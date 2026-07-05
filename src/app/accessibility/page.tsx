export const metadata = {
  title: "הצהרת נגישות | GenAI: From Zero to Hero",
  description: "הצהרת הנגישות של GenAI: From Zero to Hero - התאמות הנגישות באתר, פרטי רכז/ת הנגישות ודרכי פנייה.",
};

const UPDATED = new Date().toLocaleDateString("he-IL", { year: "numeric", month: "long", day: "numeric" });

export default function AccessibilityStatementPage() {
  return (
    <main className="min-h-screen px-6 py-16" style={{ background: "var(--cream)" }}>
      <div className="max-w-2xl mx-auto text-right space-y-4">
        <h1 className="text-4xl font-bold" style={{ color: "var(--mocha-dark)" }}>
          הצהרת נגישות
        </h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          עודכן לאחרונה: {UPDATED} · ההצהרה נבדקת ומתעדכנת לפחות אחת לשנה
        </p>

        <section className="rounded-2xl p-6 mt-4" style={{ background: "var(--surface)", border: "1.5px solid var(--border)" }}>
          <h2 className="text-lg font-bold mb-2" style={{ color: "var(--mocha-dark)" }}>על מה ההצהרה הזו חלה</h2>
          <p style={{ color: "var(--text-secondary)" }}>
            הצהרה זו חלה על אתר GenAI: From Zero to Hero. אנחנו רואים חשיבות עליונה במתן שירות שוויוני ונגיש
            לכלל הציבור, ובכלל זה לאנשים עם מוגבלות, ופועלים באופן שוטף להנגשת האתר והתכנים שבו.
          </p>
        </section>

        <section className="rounded-2xl p-6" style={{ background: "var(--surface)", border: "1.5px solid var(--border)" }}>
          <h2 className="text-lg font-bold mb-2" style={{ color: "var(--mocha-dark)" }}>התקן שאנחנו עובדים לפיו</h2>
          <p style={{ color: "var(--text-secondary)" }}>
            התאמות הנגישות מבוצעות בהתאם לחוק שוויון זכויות לאנשים עם מוגבלות, התשנ&quot;ח-1998, ולתקנות שוויון
            זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע&quot;ג-2013, לפי הנדרש בתקן הישראלי ת&quot;י 5568
            ברמה AA (המבוסס על הנחיות WCAG 2.0 הבינלאומיות).
          </p>
        </section>

        <section className="rounded-2xl p-6" style={{ background: "var(--surface)", border: "1.5px solid var(--border)" }}>
          <h2 className="text-lg font-bold mb-2" style={{ color: "var(--mocha-dark)" }}>מה תמצאו באתר</h2>
          <ul className="list-disc pr-5 space-y-1" style={{ color: "var(--text-secondary)" }}>
            <li>האתר תוכנן לניווט באמצעות מקלדת, כולל סימון מוקד (פוקוס) ברור וקישור &quot;דילוג לתוכן&quot;</li>
            <li>התאמה לקוראי מסך: מבנה כותרות מסודר, טקסט חלופי (alt) לתמונות ותוויות לשדות טפסים</li>
            <li>הגדרת שפה עברית ותצוגה מלאה מימין לשמאל</li>
            <li>
              תפריט נגישות זמין בכל דף (הכפתור העגול בפינה השמאלית התחתונה): הגדלת טקסט, ניגודיות מוגברת, הדגשת
              קישורים, עצירת אנימציות וגופן קריא - ההעדפות נשמרות לביקורים הבאים
            </li>
          </ul>
        </section>

        <section className="rounded-2xl p-6" style={{ background: "var(--surface)", border: "1.5px solid var(--border)" }}>
          <h2 className="text-lg font-bold mb-2" style={{ color: "var(--mocha-dark)" }}>רכיבים של ספקים חיצוניים</h2>
          <p style={{ color: "var(--text-secondary)" }}>
            ייתכן שחלק מהשירותים באתר משולבים ברכיבים של צדדים שלישיים - למשל טפסים חיצוניים או סרטונים מוטמעים
            - שנגישותם באחריות ספקיהם ואינה בשליטתנו המלאה. נתקלתם בקושי ברכיב כזה? פנו אלינו ונשלים אתכם את
            הפעולה בדרך חלופית נגישה.
          </p>
        </section>

        <section className="rounded-2xl p-6" style={{ background: "var(--surface)", border: "1.5px solid var(--border)" }}>
          <h2 className="text-lg font-bold mb-2" style={{ color: "var(--mocha-dark)" }}>מגבלות ידועות</h2>
          <p style={{ color: "var(--text-secondary)" }}>
            אנחנו פועלים להנגיש את כלל הדפים והתכנים, ועדיין ייתכן שתמצאו רכיב שטרם הונגש במלואו. כל פנייה
            מטופלת, ובינתיים נספק את המידע בדרך חלופית נגישה - מסמך מונגש, תמליל או מענה אנושי.
          </p>
        </section>

        <section className="rounded-2xl p-6" style={{ background: "#eef2ff", border: "1.5px solid #c7d2fe" }}>
          <h2 className="text-lg font-bold mb-2" style={{ color: "var(--mocha-dark)" }}>רכז/ת הנגישות</h2>
          <p style={{ color: "var(--text-secondary)" }}><strong>שם:</strong> זאב גרינברג</p>
          <p style={{ color: "var(--text-secondary)" }} dir="ltr">
            <strong style={{ marginLeft: 4 }}>דוא&quot;ל:</strong>
            <a href="mailto:zeev.grinberg@ness-tech.co.il" style={{ color: "#4338ca" }}>zeev.grinberg@ness-tech.co.il</a>
          </p>
          <p className="mt-3" style={{ color: "var(--text-secondary)" }}>
            אפשר לפנות אלינו לדיווח על בעיית נגישות, לבקשת מידע או מסמך בפורמט נגיש, או לבקשת התאמה אישית. נאשר
            את קבלת הפנייה בתוך יום עסקים אחד, ונטפל בה בתוך 5 ימי עסקים לכל היותר. מועיל לצרף את כתובת הדף
            ותיאור קצר של הקושי.
          </p>
          <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
            לא קיבלתם מענה מספק? עומדת לכם הזכות לפנות לנציבות שוויון זכויות לאנשים עם מוגבלות במשרד המשפטים.
          </p>
        </section>

        <footer className="text-center text-xs py-6" style={{ color: "var(--text-muted)" }}>
          GenAI: From Zero to Hero · ההצהרה מתעדכנת בכל שינוי מהותי באתר ולפחות אחת לשנה
        </footer>
      </div>
    </main>
  );
}
