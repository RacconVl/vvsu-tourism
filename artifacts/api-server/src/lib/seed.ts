import bcrypt from "bcryptjs";
import { db, usersTable, quizzesTable, quizQuestionsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { logger } from "./logger";

export async function seedAdminUser(): Promise<void> {
  try {
    const adminEmail = "admin@vvsu.ru";
    const existing = await db.select().from(usersTable).where(eq(usersTable.email, adminEmail)).limit(1);
    if (existing.length === 0) {
      const passwordHash = await bcrypt.hash("admin123", 10);
      await db.insert(usersTable).values({
        email: adminEmail,
        passwordHash,
        name: "Администратор ВВГУ",
        role: "admin",
        studentRole: "admin",
        bio: "Преподаватель Института туризма и креативных индустрий",
        level: 10,
        xp: 5000,
      });
      logger.info({ email: adminEmail }, "Seeded default admin user");
    }
  } catch (e) {
    logger.error({ err: e }, "Failed to seed admin user");
  }
}

const SEED_QUIZZES = [
  {
    title: "История Владивостока",
    description: "Проверьте свои знания об основании города, ключевых событиях и исторических личностях.",
    category: "history",
    difficulty: "easy",
    xpReward: 150,
    estimatedMinutes: 8,
    imageUrl: "https://images.unsplash.com/photo-1574492943744-cfb27680f7ce?w=600",
    questions: [
      { question: "В каком году был основан Владивосток?", options: ["1856", "1860", "1872", "1898"], correctIndex: 1, explanation: "Владивосток был основан 2 июля 1860 года как военный пост на берегу бухты Золотой Рог." },
      { question: "Что означает слово «Владивосток»?", options: ["«Восточный город»", "«Владеть Востоком»", "«Свободный порт»", "«Город у моря»"], correctIndex: 1, explanation: "Название образовано от слов «владеть» и «восток»." },
      { question: "В каком году Владивостоку был присвоен статус города?", options: ["1860", "1875", "1880", "1888"], correctIndex: 2, explanation: "Статус города Владивосток получил 22 апреля 1880 года." },
      { question: "Какое событие произошло во Владивостоке в 2012 году?", options: ["Чемпионат мира по футболу", "Саммит АТЭС", "Открытие ДВФУ на материке", "Универсиада"], correctIndex: 1, explanation: "В сентябре 2012 года Владивосток принимал саммит АТЭС." },
    ],
  },
  {
    title: "География Приморского края",
    description: "Знаете ли вы реки, заливы, острова и горные хребты Приморья?",
    category: "geography",
    difficulty: "medium",
    xpReward: 200,
    estimatedMinutes: 10,
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600",
    questions: [
      { question: "Какой остров является самым большим в заливе Петра Великого?", options: ["Попова", "Рейнеке", "Русский", "Путятина"], correctIndex: 2, explanation: "Остров Русский площадью около 97,6 км² — крупнейший в заливе Петра Великого." },
      { question: "Как называется бухта, на берегу которой расположен исторический центр Владивостока?", options: ["Бухта Диомид", "Бухта Золотой Рог", "Уссурийский залив", "Амурский залив"], correctIndex: 1, explanation: "Бухта Золотой Рог — глубоко вдающийся в сушу залив, разделяющий Владивосток на две части." },
      { question: "Какой горный хребет является основным в Приморском крае?", options: ["Становой", "Сихотэ-Алинь", "Хамар-Дабан", "Джугджур"], correctIndex: 1, explanation: "Сихотэ-Алинь — горная страна, простирающаяся вдоль побережья Японского моря на 1200 км." },
      { question: "Какой климат характерен для Владивостока?", options: ["Резко-континентальный", "Муссонный умеренный", "Субтропический", "Морской арктический"], correctIndex: 1, explanation: "Владивосток имеет умеренный муссонный климат с холодной сухой зимой и тёплым влажным летом." },
    ],
  },
  {
    title: "Природа и заповедники Приморья",
    description: "Тест на знание уникальной флоры и фауны Дальнего Востока.",
    category: "nature",
    difficulty: "medium",
    xpReward: 200,
    estimatedMinutes: 10,
    imageUrl: "https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?w=600",
    questions: [
      { question: "Какой большой кошачий хищник — символ Приморского края?", options: ["Снежный барс", "Амурский тигр", "Дальневосточный леопард", "Рысь"], correctIndex: 1, explanation: "Амурский тигр — самый крупный подвид тигра в мире. Изображён на гербе Приморского края." },
      { question: "Какое редчайшее животное России обитает только в Приморье?", options: ["Дальневосточный леопард", "Амурский лесной кот", "Красный волк", "Манул"], correctIndex: 0, explanation: "Дальневосточный леопард — самая редкая крупная кошка планеты." },
      { question: "Какой национальный парк создан для охраны амурского леопарда?", options: ["Удэгейская легенда", "Бикин", "Земля леопарда", "Зов тигра"], correctIndex: 2, explanation: "Национальный парк «Земля леопарда» создан в 2012 году на юго-западе Приморья." },
      { question: "Какой первый в России морской заповедник расположен в Приморье?", options: ["Кроноцкий заповедник", "Дальневосточный морской заповедник", "Курильский заповедник", "Сахалинский заповедник"], correctIndex: 1, explanation: "Дальневосточный морской заповедник, основанный в 1978 году — первый морской заповедник в России." },
    ],
  },
  {
    title: "Культура и достопримечательности",
    description: "Музеи, театры, архитектура и креативные пространства Владивостока.",
    category: "culture",
    difficulty: "easy",
    xpReward: 150,
    estimatedMinutes: 7,
    imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600",
    questions: [
      { question: "Какой музей считается главным краеведческим музеем Приморья?", options: ["Музей Тихоокеанского флота", "Приморский музей им. В.К. Арсеньева", "Государственная картинная галерея", "Музей города Владивостока"], correctIndex: 1, explanation: "Приморский государственный объединённый музей имени В.К. Арсеньева — старейший и крупнейший музей Дальнего Востока." },
      { question: "Как называется главная пешеходная улица Владивостока?", options: ["Светланская", "Адмирала Фокина", "Океанский проспект", "Алеутская"], correctIndex: 1, explanation: "Улица Адмирала Фокина — главная пешеходная улица города, известная как «Владивостокский Арбат»." },
      { question: "Где расположен Дальневосточный федеральный университет (ДВФУ)?", options: ["В центре Владивостока", "На острове Русский", "В районе Чуркин", "В Артёме"], correctIndex: 1, explanation: "Кампус ДВФУ построен на острове Русский к саммиту АТЭС-2012." },
      { question: "Какое архитектурное сооружение — символ Владивостока?", options: ["Триумфальная арка", "Золотой мост", "Памятник Муравьёву-Амурскому", "Маяк Эгершельда"], correctIndex: 1, explanation: "Золотой мост через бухту Золотой Рог стал главным архитектурным символом современного Владивостока." },
    ],
  },
  {
    title: "Туризм и индустрия гостеприимства Приморья",
    description: "Профессиональный тест для будущих специалистов туристической отрасли.",
    category: "tourism",
    difficulty: "hard",
    xpReward: 300,
    estimatedMinutes: 12,
    imageUrl: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600",
    questions: [
      { question: "Какой режим действует во Владивостоке для упрощённого въезда иностранных туристов?", options: ["Безвизовый въезд для всех стран", "Свободный порт Владивосток", "Особая экономическая зона", "Чартерный режим"], correctIndex: 1, explanation: "Режим Свободного порта Владивосток (с 2015 г.) предусматривает упрощённый визовый режим." },
      { question: "Какой природный объект Приморья включён в список ЮНЕСКО?", options: ["Озеро Ханка", "Центральный Сихотэ-Алинь", "Остров Русский", "Бухта Золотой Рог"], correctIndex: 1, explanation: "Центральный Сихотэ-Алинь включён в список Всемирного природного наследия ЮНЕСКО в 2001 году." },
      { question: "Какая форма туризма наиболее перспективна для развития на острове Русский?", options: ["Промышленный туризм", "Образовательный и научный туризм", "Экстремальный альпинизм", "Зимние горнолыжные курорты"], correctIndex: 1, explanation: "Остров Русский с ДВФУ — идеальная площадка для образовательного и научного туризма." },
      { question: "Какое гастрономическое событие ежегодно проводится во Владивостоке?", options: ["Фестиваль «Русская кухня»", "Фестиваль морепродуктов", "Форум шеф-поваров России", "Приморская ярмарка вин"], correctIndex: 1, explanation: "Фестиваль морепродуктов — ежегодное кулинарное событие, символизирующее богатство Японского моря." },
    ],
  },
];

export async function seedQuizzes(): Promise<void> {
  try {
    const [countRow] = await db.select({ c: sql<number>`count(*)::int` }).from(quizzesTable);
    if ((countRow?.c ?? 0) > 0) return;

    for (const q of SEED_QUIZZES) {
      const [quiz] = await db.insert(quizzesTable).values({
        title: q.title,
        description: q.description,
        category: q.category,
        difficulty: q.difficulty,
        xpReward: q.xpReward,
        estimatedMinutes: q.estimatedMinutes,
        imageUrl: q.imageUrl,
      }).returning();
      await db.insert(quizQuestionsTable).values(
        q.questions.map((qq, i) => ({
          quizId: quiz.id,
          question: qq.question,
          options: qq.options,
          correctIndex: qq.correctIndex,
          explanation: qq.explanation,
          order: i,
        })),
      );
    }
    logger.info("Seeded 5 quizzes to database");
  } catch (e) {
    logger.error({ err: e }, "Failed to seed quizzes");
  }
}
