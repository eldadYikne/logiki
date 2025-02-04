import { Button } from "rsuite";

const testimonials = [
  {
    text: "השימוש באתר פשוט מעולה. עשה לנו המון סדר ביחידה!",
    author: "איתמר נבון",
  },
  {
    text: "חסכנו שעות עבודה רבות בזכות הכלי הזה. פשוט חוויה לנהל דרכו את המלאי.",
    author: "עומר לוי",
  },
  {
    text: "מערכת נוחה ואינטואיטיבית שפשוט עובדת. ממליץ בחום!",
    author: "דנה רוזנברג",
  },
];

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 w-full to-blue-100 p-8">
      <header className="flex justify-end items-center bg-transparent  p-4  mb-8">
        {/* <h1 className="text-3xl font-bold text-blue-600">ניהול לוגיסטי חכם</h1> */}
        <Button
          appearance="primary"
          size="lg"
          onClick={() => (window.location.href = "/login")}
        >
          התחבר
        </Button>
      </header>
      <header className="flex justify-center items-center bg-gradient-to-b from-white w-full to-slate-100 p-8 shadow-md rounded-xl mb-8">
        <div className="flex flex-col justify-center items-center w-1/2">
          <h1 className=" sm:text-4xl text-2xl text-center font-semibold text-gray-700 mb-4">
            פתרונות לוגיסטיקה ותוכנה מתקדמים
          </h1>
          <h3 className=" sm:text-2xl text-base text-center font-semibold text-gray-700 mb-4">
            בואו להיעזר בטכנולוגייה וכלי AI מהמתקדמים בשוק
          </h3>
          <Button
            appearance="primary"
            color="green"
            className="sm:w-36"
            // onClick={() => (window.location.href = "/login")}
          >
            התחל
          </Button>
        </div>
        <img
          className="h-44"
          src="../src/assets/arranging-files.png"
          loading="lazy"
          alt=""
        />
      </header>
      <main className="max-w-4xl mx-auto space-y-8">
        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            ניהול לוגיסטי חכם בשליטה מלאה
          </h2>
          <p className="text-gray-600 leading-relaxed">
            האפליקציה שלנו מציעה פתרון חדשני ויעיל לניהול לוגיסטי ושליטה במלאי,
            המותאם לצרכים של יחידות לוגיסטיות בארגונים ובמערכת הביטחון. מטרתנו
            היא לפשט את תהליך הניהול הלוגיסטי ולספק כלים חכמים לניהול יעיל
            ומדויק של ציוד, כך שתמיד תהיה שליטה מלאה בכל מה שקורה במחסנים
            ובמלאי.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            פותחה על ידי מילואימניקים – משרתת מאות חיילים
          </h2>
          <p className="text-gray-600 leading-relaxed">
            האפליקציה נבנתה על ידי צוות מילואימניקים בעלי ניסיון עשיר בתפעול
            לוגיסטי. אנחנו מכירים היטב את הצרכים של היחידות בשטח ויודעים כמה
            קריטי לשמור על סדר, דיוק וזמינות של ציוד. כיום, האפליקציה משרתת
            בהצלחה מאות חיילים ומאפשרת להם ניהול חכם וממוקד יותר של תהליכי
            לוגיסטיקה.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            מה השירות כולל?
          </h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>מעקב אחר מלאי בזמן אמת</li>
            <li>דוחות מותאמים אישית</li>
            <li>תיעוד ואימות של תנועות ציוד</li>
            <li>ממשק קל לשימוש עם תמיכה מלאה בצרכי היחידות</li>
          </ul>
        </section>

        <section className="flex flex-col gap-2  ">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            המלצות מהשטח
          </h2>
          {/* <Slider {...sliderSettings}> */}
          <div className="flex sm:flex-row flex-col gap-2">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-6 bg-white shadow-md rounded-xl text-center"
              >
                <p className="text-gray-700 italic mb-4">
                  "{testimonial.text}"
                </p>
                <p className="text-blue-600 font-semibold">
                  - {testimonial.author}
                </p>
              </div>
            ))}
          </div>
          {/* </Slider> */}
        </section>

        <section className="text-center mt-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            מצטרפים לשינוי בלוגיסטיקה
          </h2>
          <p className="text-gray-600 mb-4">
            אם גם אתם רוצים להוביל את היחידה שלכם לניהול לוגיסטי חכם ויעיל יותר
            — זה הזמן להצטרף למהפכה.
          </p>
          <Button
            appearance="primary"
            onClick={() => (window.location.href = "/join")}
          >
            הצטרפו עכשיו
          </Button>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
