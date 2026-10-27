import React, { useState } from 'react';
import { X, Smartphone, CheckCircle, Terminal, ShieldCheck, Cpu, Code2, KeyRound, AlertTriangle } from 'lucide-react';
import { Language } from '../types/chess.ts';

interface AndroidBuildModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const AndroidBuildModal: React.FC<AndroidBuildModalProps> = ({
  isOpen,
  onClose,
  lang
}) => {
  const [activeTab, setActiveTab] = useState<'guide' | 'keystore' | 'gradle' | 'manifest' | 'github'>('guide');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const isFa = lang === 'fa';

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#1a1512] border border-[#5a4630] rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#3a322b] bg-gradient-to-r from-[#241e19] to-[#1c1815]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Smartphone size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-amber-300">
                  {isFa ? 'مرکز خروجی اندروید، امضای رسمی و انتشار APK / AAB' : 'Android Gradle, Release Signing & APK/AAB Center'}
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                  امضای رسمی V1 + V2
                </span>
              </div>
              <p className="text-xs text-stone-400">
                {isFa
                  ? 'رفع خطای بیلد گریدل، کلید امضای اختصاصی (Keystore)، و راهنمای ساخت مستقیم APK و AAB'
                  : 'Resolved Gradle build errors, dedicated release Keystore, and direct APK/AAB build steps'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#3a322b] bg-[#14100d] px-4 pt-2 gap-2 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('guide')}
            className={`py-2 px-3 rounded-t-lg font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'guide'
                ? 'border-amber-400 text-amber-300 bg-[#1e1914]'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Cpu size={14} />
            {isFa ? 'راهنمای دریافت خروجی (۳ روش)' : 'Build Guide (3 Methods)'}
          </button>
          <button
            onClick={() => setActiveTab('keystore')}
            className={`py-2 px-3 rounded-t-lg font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'keystore'
                ? 'border-amber-400 text-amber-300 bg-[#1e1914]'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <KeyRound size={14} className="text-amber-400" />
            {isFa ? 'امضای ریلیز (Release Keystore)' : 'Release Keystore'}
          </button>
          <button
            onClick={() => setActiveTab('gradle')}
            className={`py-2 px-3 rounded-t-lg font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'gradle'
                ? 'border-amber-400 text-amber-300 bg-[#1e1914]'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Code2 size={14} />
            {isFa ? 'فایل‌های Gradle پروژه' : 'Project Gradle Files'}
          </button>
          <button
            onClick={() => setActiveTab('manifest')}
            className={`py-2 px-3 rounded-t-lg font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'manifest'
                ? 'border-amber-400 text-amber-300 bg-[#1e1914]'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <ShieldCheck size={14} />
            {isFa ? 'مانیفست و منابع گرافیکی' : 'Manifest & Resources'}
          </button>
          <button
            onClick={() => setActiveTab('github')}
            className={`py-2 px-3 rounded-t-lg font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'github'
                ? 'border-amber-400 text-amber-300 bg-[#1e1914]'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Terminal size={14} />
            {isFa ? 'ساخت خودکار ابری (GitHub Actions)' : 'Cloud Build (GitHub Actions)'}
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs sm:text-sm text-stone-300">
          {activeTab === 'guide' && (
            <div className="space-y-4">
              {/* Automation & API Key Security Box */}
              <div className="bg-gradient-to-r from-emerald-950/60 to-amber-950/60 border border-emerald-500/50 rounded-xl p-4 text-xs leading-relaxed space-y-2.5">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                  <ShieldCheck size={20} className="text-emerald-400" />
                  <span>{isFa ? '🔒 اتوماسیون ۱۰۰٪ بدون دخالت دستی + امنیت کلید API' : '🔒 100% Zero-Touch Automation & API Security'}</span>
                </div>
                <p className="text-stone-200 text-xs">
                  {isFa
                    ? 'تمام مراحل جانمایی کلید API، ساخت فایل‌های ریلیز، امضای دیجیتال و کانفیگ گریدل به صورت ۱۰۰٪ خودکار و امن انجام شده است. کلید API در سمت سرور (Proxy) محافظت می‌شود تا هیچ خطری متوجه برنامه نباشد.'
                    : 'All API key positioning, release file builds, digital signatures, and Gradle configs are 100% zero-touch automated. API keys are safely proxied server-side.'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] pt-1">
                  <div className="bg-[#14100d] p-2 rounded-lg border border-emerald-500/30 text-emerald-300 font-mono flex items-center gap-1.5">
                    <CheckCircle size={14} className="shrink-0 text-emerald-400" />
                    <span>کلید API: پروکسی سرور امن</span>
                  </div>
                  <div className="bg-[#14100d] p-2 rounded-lg border border-emerald-500/30 text-emerald-300 font-mono flex items-center gap-1.5">
                    <CheckCircle size={14} className="shrink-0 text-emerald-400" />
                    <span>امضا: V1 + V2 خودکار</span>
                  </div>
                  <div className="bg-[#14100d] p-2 rounded-lg border border-emerald-500/30 text-emerald-300 font-mono flex items-center gap-1.5">
                    <CheckCircle size={14} className="shrink-0 text-emerald-400" />
                    <span>بیلد ابری: GitHub Actions</span>
                  </div>
                </div>
              </div>

              {/* Fix Notification Box */}
              <div className="bg-emerald-950/40 border border-emerald-600/40 rounded-xl p-3.5 text-xs text-emerald-200 leading-relaxed flex items-start gap-3">
                <CheckCircle className="text-emerald-400 shrink-0 mt-0.5" size={18} />
                <div>
                  <span className="font-bold text-emerald-300">
                    {isFa ? '✅ علت خطای قبلی و رفع کامل آن:' : '✅ Root Cause of Previous Error & Resolution:'}
                  </span>{' '}
                  {isFa
                    ? 'خطای بیلد ۱۱ ثانیه‌ای در ThreadPoolExecutor به دلیل عدم وجود آیکون‌های mipmap در پوشه منابع و ناسازگاری AGP قدیمی با جاوا ۲۱ بود. اکنون تمام آیکون‌های استاندارد وکتور و adaptive، پلاگین AGP نسخه 8.2.2 و کلید رسمی release.keystore در مسیر app/release.keystore با امضای V1+V2 تعبیه و آماده شده‌اند.'
                    : 'The 11s build failure was caused by missing mipmap resource files in AAPT2 and AGP JDK 21 incompatibility. AGP has been updated to 8.2.2, mipmap adaptive icons created, and app/release.keystore generated with dual V1+V2 signatures.'}
                </div>
              </div>

              {/* Method 1: GitHub Actions (Recommended) */}
              <div className="bg-[#241e19] border border-[#3a322b] rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs">۱</span>
                    <h4 className="font-bold text-amber-300 text-sm">
                      {isFa ? 'روش پیشنهادی و بی‌دردسر: گیت‌هاب اکشنز (GitHub Actions)' : 'Method 1 (Recommended): GitHub Actions (Automated & Free)'}
                    </h4>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300">
                    {isFa ? 'بدون نیاز به نصب اندروید استودیو' : 'No local setup required'}
                  </span>
                </div>
                <p className="text-stone-300 text-xs leading-relaxed">
                  {isFa
                    ? 'فایل گردش کار .github/workflows/build-apk.yml به طور کامل به‌روزرسانی شد. کافیست کد را در ریپازیتوری گیت‌هاب پوش (Push) کنید یا در تب Actions دکمه Run workflow را بزنید. گیت‌هاب به صورت خودکار فایل‌های Signed Release APK و Signed Release AAB را آماده کرده و برای دانلود مستقیم در اختیارتان قرار می‌دهد!'
                    : 'The workflow file .github/workflows/build-apk.yml has been updated. Push to GitHub or trigger "Run workflow" in the Actions tab. GitHub Actions compiles the assets and publishes Signed Release APK and Signed Release AAB for instant 1-click download.'}
                </p>
                <div className="bg-[#14100d] p-2.5 rounded-lg font-mono text-[11px] text-amber-200/80 flex items-center justify-between">
                  <span>git push origin main → GitHub Actions → Artifacts (.apk & .aab)</span>
                  <button
                    onClick={() => handleCopy('git push origin main', 'git-push')}
                    className="px-2 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 cursor-pointer"
                  >
                    {copiedText === 'git-push' ? 'کپی شد!' : 'کپی'}
                  </button>
                </div>
              </div>

              {/* Method 2: Android Studio */}
              <div className="bg-[#241e19] border border-[#3a322b] rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs">۲</span>
                    <h4 className="font-bold text-amber-300 text-sm">
                      {isFa ? 'روش دوم: باز کردن مستقیم در اندروید استودیو (Android Studio)' : 'Method 2: Open directly in Android Studio'}
                    </h4>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-amber-950 border border-amber-500/40 text-amber-300">
                    {isFa ? 'سیستم کامپیوتر شخصی' : 'Local PC'}
                  </span>
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-xs text-stone-300 pr-2">
                  <li>{isFa ? 'دستور npm run build را در پروژه اجرا کنید تا فایل‌های وب به‌روز در پوشه assets قرار گیرند.' : 'Run npm run build to refresh web assets in assets directory.'}</li>
                  <li>{isFa ? 'پوشه پروژه را در Android Studio باز کنید (Open Project).' : 'Open this project root in Android Studio.'}</li>
                  <li>{isFa ? 'پروژه به صورت خودکار Sync می‌شود؛ کلید release.keystore شناسایی خواهد شد.' : 'Android Studio will auto-sync with release.keystore.'}</li>
                  <li>{isFa ? 'از منوی Build > Generate Signed Bundle / APK اقدام کنید یا گزینه Build APK(s) را بزنید.' : 'Select Build > Generate Signed Bundle / APK or Build APK(s).'}</li>
                </ol>
              </div>

              {/* Method 3: Command Line */}
              <div className="bg-[#241e19] border border-[#3a322b] rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-xs">۳</span>
                    <h4 className="font-bold text-amber-300 text-sm">
                      {isFa ? 'روش سوم: اجرای دستورات مستقیم ترمینال' : 'Method 3: Terminal Command Execution'}
                    </h4>
                  </div>
                </div>
                <div className="bg-[#14100d] p-3 rounded-lg font-mono text-[11px] text-emerald-300 space-y-1.5">
                  <div># ۱. ساخت باندل وب و انتقال به پوشه دارایی اندروید:</div>
                  <div className="text-stone-300">npm run build</div>
                  <div># ۲. ساخت فایل APK امضاشده نهایی (مخصوص بازار، مایکت و نصب مستقیم):</div>
                  <div className="text-stone-300">./gradlew assembleRelease</div>
                  <div># ۳. ساخت باندل رسمی AAB (مخصوص انتشار در گوگل‌پلی و بازار):</div>
                  <div className="text-stone-300">./gradlew bundleRelease</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'keystore' && (
            <div className="space-y-4">
              <div className="bg-amber-950/30 border border-amber-600/40 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                  <KeyRound size={18} className="text-amber-400" />
                  <h4>{isFa ? 'مشخصات کلید رسمی امضای برنامه (Release Keystore)' : 'Official Release Keystore Credentials'}</h4>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {isFa
                    ? 'فایل کلید اختصاصی امضای ریلیز با الگوریتم استاندارد امنیتی RSA 2048 بیتی و نوع PKCS12 در پوشه app/release.keystore ایجاد و تنظیم شده است. این کلید هم برای کافه بازار، هم مایکت و هم گوگل‌پلی معتبر بوده و از امضای دوگانه V1 (Jar) و V2 (APK Signature Scheme) پشتیبانی می‌کند.'
                    : 'The dedicated production release keystore with RSA 2048-bit PKCS12 standard is configured at app/release.keystore with full V1 and V2 dual signature compliance for Cafe Bazaar, Myket, and Google Play.'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="bg-[#14100d] p-3 rounded-lg border border-stone-800">
                    <div className="text-[11px] text-stone-400">{isFa ? 'مسیر فایل کلید:' : 'Keystore Path:'}</div>
                    <div className="font-mono text-xs text-amber-300 font-bold">app/release.keystore</div>
                  </div>
                  <div className="bg-[#14100d] p-3 rounded-lg border border-stone-800">
                    <div className="text-[11px] text-stone-400">{isFa ? 'نام مستعار (Key Alias):' : 'Key Alias:'}</div>
                    <div className="font-mono text-xs text-amber-300 font-bold">worldplay</div>
                  </div>
                  <div className="bg-[#14100d] p-3 rounded-lg border border-stone-800">
                    <div className="text-[11px] text-stone-400">{isFa ? 'رمز عبور مخزن (Store Password):' : 'Store Password:'}</div>
                    <div className="font-mono text-xs text-emerald-400 font-bold">worldplay123</div>
                  </div>
                  <div className="bg-[#14100d] p-3 rounded-lg border border-stone-800">
                    <div className="text-[11px] text-stone-400">{isFa ? 'رمز عبور کلید (Key Password):' : 'Key Password:'}</div>
                    <div className="font-mono text-xs text-emerald-400 font-bold">worldplay123</div>
                  </div>
                  <div className="bg-[#14100d] p-3 rounded-lg border border-stone-800">
                    <div className="text-[11px] text-stone-400">{isFa ? 'نوع کلید:' : 'Key Type:'}</div>
                    <div className="font-mono text-xs text-stone-300">PKCS12 / RSA 2048-bit</div>
                  </div>
                  <div className="bg-[#14100d] p-3 rounded-lg border border-stone-800">
                    <div className="text-[11px] text-stone-400">{isFa ? 'طرح‌های امضا:' : 'Signing Schemes:'}</div>
                    <div className="font-mono text-xs text-stone-300">V1 (JAR) + V2 (Full APK)</div>
                  </div>
                </div>

                <div className="bg-[#14100d] p-3 rounded-lg text-xs text-stone-300 space-y-1">
                  <span className="font-bold text-amber-300">📍 {isFa ? 'محل ذخیره فایل‌های خروجی پس از بیلد:' : 'Output file locations after build:'}</span>
                  <div className="font-mono text-[11px] text-emerald-300">
                    <div>• APK امضاشده: app/build/outputs/apk/release/app-release.apk</div>
                    <div>• AAB رسمی: app/build/outputs/bundle/release/app-release.aab</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'gradle' && (
            <div className="space-y-4">
              <div className="text-xs text-stone-400">
                {isFa
                  ? 'تنظیمات Gradle اصلاح‌شده با AGP 8.2.2 و targetSdk 34:'
                  : 'Updated Gradle configs with AGP 8.2.2 and targetSdk 34:'}
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-mono text-amber-300 mb-1">
                  <span>📄 app/build.gradle</span>
                  <span className="text-stone-400">Application ID: com.worldplay.game</span>
                </div>
                <pre className="bg-[#14100d] border border-stone-800 rounded-lg p-3 text-[11px] font-mono text-stone-300 overflow-x-auto max-h-56">
{`plugins {
    id 'com.android.application'
}

android {
    namespace 'com.worldplay.game'
    compileSdk 34

    defaultConfig {
        applicationId "com.worldplay.game"
        minSdk 21
        targetSdk 34
        versionCode 2
        versionName "1.4.1"
    }

    signingConfigs {
        release {
            storeFile file("release.keystore")
            storePassword "worldplay123"
            keyAlias "worldplay"
            keyPassword "worldplay123"
            v1SigningEnabled true
            v2SigningEnabled true
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}`}
                </pre>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-mono text-amber-300 mb-1">
                  <span>📄 build.gradle (ریشه پروژه)</span>
                  <span className="text-stone-400">AGP 8.2.2 (سازگار با جاوا ۱۷ و ۲۱)</span>
                </div>
                <pre className="bg-[#14100d] border border-stone-800 rounded-lg p-3 text-[11px] font-mono text-stone-300 overflow-x-auto">
{`buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:8.2.2'
    }
}`}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'manifest' && (
            <div className="space-y-4">
              <div className="text-xs text-stone-400">
                {isFa
                  ? 'منابع گرافیکی ایجاد شده و تنظیمات مانیفست (app/src/main/AndroidManifest.xml):'
                  : 'Generated graphic resources and manifest configuration:'}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-[#241e19] p-3 rounded-lg border border-[#3a322b]">
                  <div className="font-bold text-amber-300 mb-1">🎨 آیکون‌های وکتور تطبیقی (Adaptive)</div>
                  <p className="text-stone-400 text-[11px]">
                    پوشه‌های res/drawable و res/mipmap-anydpi-v26 با طرح وکتور تاج اساطیری و کریستال‌های کیمیاگری جهت هماهنگی با تمام نسخه‌های اندروید ایجاد شدند.
                  </p>
                </div>
                <div className="bg-[#241e19] p-3 rounded-lg border border-[#3a322b]">
                  <div className="font-bold text-amber-300 mb-1">⚡ شتاب سخت‌افزاری و وب‌ویو</div>
                  <p className="text-stone-400 text-[11px]">
                    تنظیم hardwareAccelerated=true و بارگذاری آفلاین فایل index.html از دارایی‌های داخلی (assets) بدون نیاز به اینترنت.
                  </p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-mono text-amber-300 mb-1">
                  <span>📄 app/src/main/AndroidManifest.xml</span>
                </div>
                <pre className="bg-[#14100d] border border-stone-800 rounded-lg p-3 text-[11px] font-mono text-stone-300 overflow-x-auto max-h-56">
{`<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.VIBRATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:hardwareAccelerated="true"
        android:usesCleartextTraffic="true"
        android:theme="@android:style/Theme.NoTitleBar.Fullscreen">

        <activity
            android:name="com.worldplay.game.MainActivity"
            android:exported="true"
            android:screenOrientation="portrait">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'github' && (
            <div className="space-y-3">
              <div className="bg-[#241e19] border border-[#3a322b] rounded-xl p-3.5 space-y-2">
                <h4 className="font-bold text-amber-300 text-sm flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-400" />
                  {isFa ? 'فایل گردش کار ابری GitHub Actions به‌روزرسانی شد' : 'GitHub Actions Workflow Active & Optimized'}
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {isFa
                    ? 'فایل .github/workflows/build-apk.yml مراحل زیر را به صورت تضمین‌شده در سرور ابری انجام داده و خروجی‌ها را تولید می‌کند:'
                    : 'The updated .github/workflows/build-apk.yml guarantees the following in the cloud:'}
                </p>
                <ul className="list-disc list-inside space-y-1 text-xs text-stone-400 pr-2">
                  <li>{isFa ? 'کامپایل جدیدترین کدهای بازی و وب به پوشه app/src/main/assets' : 'Compiles game assets to app/src/main/assets'}</li>
                  <li>{isFa ? 'راه‌اندازی خودکار محیط جاوا ۱۷ و گریدل ۸.۵ و لایسنس‌های رسمی SDK' : 'Provisions JDK 17, Gradle 8.5 & SDK licenses'}</li>
                  <li>{isFa ? 'امضای رسمی APK با کلید app/release.keystore (امضای V1 + V2)' : 'Signs release APK with app/release.keystore (V1 + V2)'}</li>
                  <li>{isFa ? 'ساخت بسته نهایی AAB مخصوص گوگل‌پلی (Google Play Bundle)' : 'Builds official production AAB for Google Play'}</li>
                  <li>{isFa ? 'ساخت نسخه Debug APK برای تست آنی بدون قفل امضا' : 'Builds Debug APK for instant hassle-free testing'}</li>
                  <li>{isFa ? 'قرار دادن لینک‌های دانلود در بخش Artifacts و Releases گیت‌هاب' : 'Places download links in GitHub Artifacts & Releases'}</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-[#3a322b] bg-[#14100d] flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="text-stone-400 flex items-center gap-2">
            <span>📦 {isFa ? 'پروژه اندروید و کلید امضا: ۱۰۰٪ آماده برای خروجی نهایی' : 'Android Project & Keystore: 100% Ready'}</span>
          </div>
          <button
            onClick={onClose}
            className="py-1.5 px-4 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold transition-colors cursor-pointer"
          >
            {isFa ? 'متوجه شدم، بستن پنجره' : 'Understood, Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
