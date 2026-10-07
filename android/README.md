# Android build

هذا المجلد هو مشروع Android الرسمي المولّد عبر Capacitor 6.

## إصدارات SDK المعتمدة

- `minSdkVersion`: 22
- `compileSdkVersion`: 34
- `targetSdkVersion`: 34
- Android Gradle Plugin: 8.2.1
- Gradle Wrapper: 8.2.1
- Java: 17 لتجميع التطبيق

ثبّت Android SDK Platform 34 وBuild Tools من Android Studio، ثم افتح مجلد `android` أو نفّذ:

```bash
npm install
npm run build
npx cap sync android
cd android
./gradlew assembleDebug
```

## ملاحظات الاستقرار

- تم تفعيل AndroidX وJetifier والتخزين المؤقت والتوازي في Gradle.
- تم رفع ذاكرة Gradle إلى 2GB لتقليل أخطاء البناء في المشاريع الكبيرة.
- تم تفعيل تسريع WebView وذاكرة التطبيق الأكبر لأن التطبيق يستخدم تصدير PDF وملفات Excel.
- لا تضع `local.properties` أو مفاتيح التوقيع داخل Git؛ يحدد Android Studio مسار SDK محليًا تلقائيًا.
- لإصدار APK موقّع، استخدم Android Studio أو إعداد keystore آمنًا خارج المستودع.
