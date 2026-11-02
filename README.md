# Titan Fitness - Member Mobile App (React Native & TypeScript)

Titan Fitness Gym Management System အတွက် အသင်းဝင် (Member) များ အသုံးပြုရန် **React Native (Expo + TypeScript)** ဖြင့် တည်ဆောက်ထားသော Mobile Application Codebase ဖြစ်ပါသည်။

---

## 🌟 အဓိက ပါဝင်သော လုပ်ဆောင်ချက်များ (Key Features)

1. **Digital Membership Card & Pass (ကတ်ပြား)**
   - Member Name, Member Code, Home Branch, Active Plan နှင့် သက်တမ်းကုန်ဆုံးမည့် ရက်များ ပြသခြင်း။
   - Turnstile Kiosk တွင် တိုက်ရိုက် Scan ဖတ်နိုင်သော Dynamic Digital QR Pass။
   - အသင်းဝင်၏ Lifetime Workout Statistics (စုစုပေါင်း လာရောက်မှု အကြိမ်ရေ၊ စုစုပေါင်း လေ့ကျင့်ချိန်၊ ပျမ်းမျှအချိန်)။

2. **GPS Geofencing Auto Check-In & Live Workout Stopwatch (လေ့ကျင့်ခန်း)**
   - **Haversine Distance Radar:** Gym အားကစားရုံနှင့် အသင်းဝင်၏ ဖုန်းကြားရှိ အကွာအဝေးကို Live မီတာဖြင့် တွက်ချက်ပြသခြင်း။
   - **Geofence Zone Detection (60m):** Gym ၏ 60 မီတာ အဝန်းအဝိုင်းအတွင်း ရောက်ရှိပါက **Auto Check-In** ဝင်ရောက်နိုင်ခြင်း။
   - **Live Ticking Stopwatch:** Gym အတွင်း ရောက်ရှိချိန်မှစ၍ လေ့ကျင့်ချိန် (`HH:MM:SS`) ကို စက္ကန့်နှင့်အမျှ ပြသခြင်း။
   - **Estimated Calorie Burn:** လေ့ကျင့်ချိန်အပေါ် အခြေခံ၍ လောင်ကျွမ်းသွားသော Calorie ကို တွက်ချက်ပေးခြင်း။
   - **Auto Check-Out & Duration Record:** Gym မှ ပြန်ထွက်ခွာချိန် (သို့မဟုတ် Finish ခလုတ်နှိပ်ချိန်) တွင် Gym Management System Database ထဲသို့ Workout Duration (ဥပမာ- `1h 35m`) အလိုအလျောက် မှတ်တမ်းတင်ပေးခြင်း။
   - **Location Simulator:** Downtown HQ (0m), Hledan Center (0m), Inya Lake (6km) နှင့် Device Real GPS ခလုတ်များ ပါဝင်သဖြင့် တည်နေရာပြောင်းလဲမှုကို အလွယ်တကူ စမ်းသပ်နိုင်ခြင်း။

3. **Workout History & Duration (လေ့ကျင့်မှု မှတ်တမ်း)**
   - လေ့ကျင့်ခဲ့သော နေ့စွဲ၊ အားကစားရုံခွဲ၊ Check-In ဝင်ရောက်ခဲ့သော နည်းလမ်း (`GPS Auto` vs `Kiosk Scan`)။
   - လေ့ကျင့်ခဲ့သော ကြာချိန် Duration Badge (ဥပမာ- `1h 25m`, `45m`)။

4. **Gym Branches Directory (ရုံခွဲများ)**
   - ရုံခွဲအားလုံး၏ လိပ်စာ၊ ဖုန်းနံပါတ်၊ GPS Coordinates (Lat/Lon) နှင့် Geofence Radius များ။

---

## 📱 မိုဘိုင်းဖုန်းပေါ်တွင် Run နည်း (How to Run on Mobile)

### အဆင့် (၁) - Node Modules Install လုပ်ခြင်း
PowerShell / Command Prompt ကို ဖွင့်ပြီး အောက်ပါ command ကို Run ပါ -
```bash
cd d:\Project\GymManagement.Mobile
npm install
```

### အဆင့် (၂) - Expo Development Server စတင်ခြင်း
```bash
npx expo start
```
Terminal တွင် **Metro QR Code** တစ်ခု ပေါ်လာမည်ဖြစ်ပါသည်။

### အဆင့် (၃) - Physical ဖုန်း (Android / iPhone) ပေါ်တွင် စမ်းသပ်ခြင်း
1. သင့်ဖုန်းတွင် Google Play Store (သို့) Apple App Store မှ **Expo Go** app ကို ဒေါင်းလုဒ်ဆွဲပါ။
2. ကွန်ပျူတာနှင့် ဖုန်းကို **တူညီသော WiFi (Local Network)** ချိတ်ဆက်ထားပါ။
3. Expo Go app ဖြင့် Terminal ရှိ QR Code ကို Scan ဖတ်လိုက်လျှင် ဖုန်းထဲတွင် App ချက်ချင်း ပွင့်လာပါမည်။

### အဆင့် (၄) - Backend API ချိတ်ဆက်ရန် IP ပြင်ဆင်ခြင်း
* ဖုန်းမှ ကွန်ပျူတာ Backend API (`http://localhost:5254`) သို့ တိုက်ရိုက် မရောက်နိုင်ပါ (Localhost သည် ဖုန်းကိုယ်တိုင်ကို ရည်ညွှန်းသောကြောင့်ဖြစ်သည်)။
* ထို့ကြောင့် သင့်ကွန်ပျူတာ၏ Local WiFi IP (ဥပမာ- `ipconfig` ရိုက်ကြည့်လျှင် တွေ့ရသော `192.168.1.15`) ကို သိရှိပြီးနောက် -
* Mobile App ၏ ညာဘက်အပေါ်ထောင့်ရှိ **Settings (⚙️)** ခလုတ်ကို နှိပ်ပါ။
* Backend API Base URL တွင် အောက်ပါအတိုင်း ပြောင်းထည့်ပြီး **Save & Reload** နှိပ်ပါ -
  ```
  http://192.168.1.15:5254/api/v1/mobile
  ```

---

## 📦 Standalone APK / Production Build ပြုလုပ်နည်း

Android APK သီးသန့် Build လုပ်လိုပါက Expo EAS Build ကို အသုံးပြုနိုင်ပါသည် -

```bash
# EAS CLI install လုပ်ခြင်း
npm install -g eas-cli

# Login ဝင်ခြင်း
eas login

# Android APK build စတင်ခြင်း
eas build -p android --profile preview
```

---

## 🌐 Web Browser မှ ချက်ချင်း Preview စမ်းသပ်ကြည့်ရှုလိုပါက

Backend System ကို Run ထားစဉ် အောက်ပါ Web URL ကို ဖွင့်ပါ -
👉 **`http://localhost:5254/mobile`**

* လက်တွေ့ ဖုန်းအစစ်အမှန်ပုံစံ (Smartphone Shell Frame) ဖြင့် UI ကို စမ်းသပ်နိုင်ပြီး Downtown HQ, Hledan Center စသည့် တည်နေရာများသို့ ချက်ချင်းရွှေ့ကာ Geofence Auto Check-In / Check-Out နှင့် Stopwatch Timer များကို ချက်ချင်း စမ်းသပ်နိုင်ပါသည်။
