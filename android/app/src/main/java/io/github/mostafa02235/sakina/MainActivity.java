package io.github.mostafa02235.sakina;

import android.annotation.SuppressLint;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.RenderProcessGoneDetail;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.LinearLayout;

import androidx.activity.ComponentActivity;
import androidx.activity.OnBackPressedCallback;
import androidx.core.graphics.Insets;
import androidx.core.splashscreen.SplashScreen;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import androidx.webkit.WebViewAssetLoader;

/**
 * SAKINA's only screen: a full-window WebView showing the app that is packed
 * inside the APK (assets/www). Nothing is downloaded to run the app.
 */
public class MainActivity extends ComponentActivity {

    // The packed files are served from this private address so that the
    // browser engine treats them like a normal secure website.
    private static final String APP_HOST = "appassets.androidplatform.net";
    private static final String APP_URL = "https://" + APP_HOST + "/assets/www/index.html";

    private static final int SKY = Color.parseColor("#17527A");
    private static final int PAPER = Color.parseColor("#FFF9EC");

    private WebView web;
    private boolean firstScreenReady = false;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen splash = SplashScreen.installSplashScreen(this);
        super.onCreate(savedInstanceState);

        // Keep the splash until the first screen has drawn (or 4 seconds at most).
        splash.setKeepOnScreenCondition(() -> !firstScreenReady);
        new Handler(Looper.getMainLooper()).postDelayed(() -> firstScreenReady = true, 4000);

        buildLayout();
        configureWebView();
        handleBackButton();

        if (savedInstanceState == null || web.restoreState(savedInstanceState) == null) {
            web.loadUrl(APP_URL);
        }
    }

    /** Status-bar strip, the WebView, navigation-bar strip: the app never hides under system bars. */
    private void buildLayout() {
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        WindowInsetsControllerCompat bars = WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView());
        bars.setAppearanceLightStatusBars(false);
        bars.setAppearanceLightNavigationBars(true);

        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setBackgroundColor(SKY);

        View topStrip = new View(this);
        topStrip.setBackgroundColor(SKY);
        View bottomStrip = new View(this);
        bottomStrip.setBackgroundColor(PAPER);

        web = new WebView(this);
        web.setBackgroundColor(SKY);

        root.addView(topStrip, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 0));
        root.addView(web, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 0, 1f));
        root.addView(bottomStrip, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 0));
        setContentView(root);

        ViewCompat.setOnApplyWindowInsetsListener(root, (view, insets) -> {
            Insets safe = insets.getInsets(WindowInsetsCompat.Type.systemBars() | WindowInsetsCompat.Type.displayCutout());
            Insets keyboard = insets.getInsets(WindowInsetsCompat.Type.ime());
            topStrip.getLayoutParams().height = safe.top;
            bottomStrip.getLayoutParams().height = Math.max(safe.bottom, keyboard.bottom);
            root.setPadding(safe.left, 0, safe.right, 0);
            root.requestLayout();
            return WindowInsetsCompat.CONSUMED;
        });
    }

    @SuppressLint("SetJavaScriptEnabled")
    private void configureWebView() {
        WebSettings settings = web.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);      // the save game lives here
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setTextZoom(100);                // layout is designed in fixed sizes
        settings.setMediaPlaybackRequiresUserGesture(false);
        web.setOverScrollMode(View.OVER_SCROLL_NEVER);
        web.setVerticalScrollBarEnabled(false);
        web.setHorizontalScrollBarEnabled(false);
        web.setLongClickable(false);
        web.setOnLongClickListener(v -> true);    // no text-selection menu over the game
        web.setHapticFeedbackEnabled(false);

        final WebViewAssetLoader assets = new WebViewAssetLoader.Builder()
                .setDomain(APP_HOST)
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
                .build();

        web.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return assets.shouldInterceptRequest(request.getUrl());
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri url = request.getUrl();
                if (APP_HOST.equals(url.getHost())) return false;
                try {
                    startActivity(new Intent(Intent.ACTION_VIEW, url)); // outside links open in the browser
                } catch (ActivityNotFoundException ignored) {
                    // No browser installed: stay in the app.
                }
                return true;
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                firstScreenReady = true;
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                if (request.isForMainFrame()) {
                    firstScreenReady = true;
                    view.loadDataWithBaseURL(null, ERROR_PAGE, "text/html", "UTF-8", null);
                }
            }

            @Override
            public boolean onRenderProcessGone(WebView view, RenderProcessGoneDetail detail) {
                // The browser engine was closed by the system (low memory). Start the screen again
                // instead of crashing; progress is already saved.
                recreate();
                return true;
            }
        });
    }

    /** Back goes up one level inside SAKINA; from the world map it leaves the app. */
    private void handleBackButton() {
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                web.evaluateJavascript(
                        "(function(){try{return !!(window.sakinaBack&&window.sakinaBack());}catch(e){return false;}})()",
                        handled -> {
                            if (!"true".equals(handled)) moveTaskToBack(true);
                        });
            }
        });
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        web.saveState(outState);
    }

    @Override
    protected void onResume() {
        super.onResume();
        web.onResume();
    }

    @Override
    protected void onPause() {
        web.onPause();
        super.onPause();
    }

    @Override
    protected void onDestroy() {
        ViewGroup parent = (ViewGroup) web.getParent();
        if (parent != null) parent.removeView(web);
        web.destroy();
        super.onDestroy();
    }

    private static final String ERROR_PAGE =
            "<!doctype html><html><head><meta name='viewport' content='width=device-width,initial-scale=1'>"
            + "<style>body{margin:0;height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;"
            + "gap:20px;background:#2f93b0;color:#fff;font-family:sans-serif;text-align:center;padding:24px;box-sizing:border-box}"
            + "h1{font-size:28px;margin:0}p{margin:0;font-size:17px;line-height:1.5}"
            + "a{display:inline-block;padding:14px 28px;border-radius:18px;border:3px solid #1d2a4d;background:#fff9ec;"
            + "color:#1d2a4d;font-weight:bold;font-size:18px;text-decoration:none}</style></head><body>"
            + "<h1>SAKINA</h1><p>تعذّر فتح التطبيق. حاول مرة أخرى.<br>The app could not open. Please try again.</p>"
            + "<a href='" + APP_URL + "'>إعادة المحاولة · Try again</a></body></html>";
}
