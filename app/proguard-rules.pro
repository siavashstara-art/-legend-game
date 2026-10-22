# Proguard rules for Worldplay Android
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
-keep class com.worldplay.game.MainActivity$AndroidBridge { *; }
