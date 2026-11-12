#!/usr/bin/env bash
# Launch test, run by the GitHub Actions workflow on an Android emulator.
# Usage: bash android/smoke-test.sh path/to/SAKINA.apk
set -euo pipefail

APK="$1"
PKG=io.github.mostafa02235.sakina

wait_for_ready() {
  # The app writes "SAKINA ready: ..." to the log when its first screen is drawn.
  for _ in $(seq 1 45); do
    if adb logcat -d -s SAKINA:I | grep -q "SAKINA ready"; then
      adb logcat -d -s SAKINA:I | grep "SAKINA ready" | tail -1
      return 0
    fi
    sleep 2
  done
  echo "::error::SAKINA did not reach its first screen"
  adb logcat -d | tail -300
  return 1
}

no_crash() {
  if adb logcat -d | grep -E "FATAL EXCEPTION|ANR in $PKG"; then
    echo "::error::SAKINA crashed"
    adb logcat -d | grep -A 30 "FATAL EXCEPTION" | head -80
    adb logcat -d | grep -A 45 "ANR in $PKG" | head -120
    adb shell dumpsys gfxinfo "$PKG" | head -40 || true
    return 1
  fi
  adb shell pidof "$PKG" > /dev/null || { echo "::error::SAKINA is not running"; return 1; }
}

echo "== Android version on the emulator =="
adb shell getprop ro.build.version.release
adb shell dumpsys webviewupdate | grep -i "current webview package" || true

echo "== Install =="
adb install -r "$APK"

echo "== First launch =="
adb logcat -c
adb shell am start -W -n "$PKG/.MainActivity"
wait_for_ready | tee first.txt
grep -q "returning=false" first.txt
sleep 3
no_crash
adb exec-out screencap -p > smoke-1-world.png

echo "== Tap the middle of the screen, then press Back =="
adb shell input tap 300 600
sleep 3
adb exec-out screencap -p > smoke-2-after-tap.png
adb shell input keyevent KEYCODE_BACK
sleep 2
no_crash

echo "== Close completely and open again: saved data must still be there =="
adb shell am force-stop "$PKG"
adb logcat -c
adb shell am start -W -n "$PKG/.MainActivity"
wait_for_ready | tee second.txt
grep -q "returning=true" second.txt
sleep 3
no_crash
adb exec-out screencap -p > smoke-3-after-restart.png

echo "== Script errors reported by the app, if any =="
if adb logcat -d -s SAKINA:I | grep -i -E "Uncaught|TypeError|ReferenceError|SyntaxError"; then
  echo "::error::The app reported a script error"
  exit 1
fi
echo "SAKINA launched, survived Back and a restart, and kept its saved data."
