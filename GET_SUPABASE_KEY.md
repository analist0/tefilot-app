# 🔑 איך לקבל את ה-Supabase API Key הנכון

## השגיאה:
```
Error: Invalid API key
```

## הפתרון (3 שלבים פשוטים):

### 1️⃣ לך ל-Supabase Dashboard:
https://supabase.com/dashboard/project/afbirqtarnyufscadzie/settings/api

### 2️⃣ העתק את המפתח:
תחת "Project API keys" → **anon public**

המפתח אמור להיראות כך:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS...ארוך מאוד...
```
(JWT token ארוך של 200+ תווים)

### 3️⃣ תן לי את המפתח המלא:

פשוט העתק ושלח לי את המפתח המלא, ואני אעדכן ב-Vercel ואדחף מחדש.

---

## או אם אתה רוצה לעשות זאת בעצמך:

```bash
# הוסף את המפתח האמיתי ב-Vercel:
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production --token q5N2n92R51IEHP5xNxBLMWS9

# ואז redeploy:
vercel --prod --token q5N2n92R51IEHP5xNxBLMWS9
```
