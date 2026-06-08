import { Router, type IRouter } from "express";
import {
  ListQuizzesResponse,
  GetQuizParams,
  GetQuizResponse,
  SubmitQuizParams,
  SubmitQuizBody,
  SubmitQuizResponse,
} from "@workspace/api-zod";
import { db, userQuizAttemptsTable, userActivityTable, usersTable } from "@workspace/db";
import { eq, and, desc, sql } from "drizzle-orm";
import { requireAuth, levelForXp } from "../lib/auth";

const router: IRouter = Router();

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface QuizData {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  xpReward: number;
  estimatedMinutes: number;
  imageUrl: string;
  isCompleted: boolean;
  bestScore: number | null;
  questions: QuizQuestion[];
}

const QUIZZES: QuizData[] = [
  {
    id: 1,
    title: "История Владивостока",
    description: "Проверьте свои знания об основании города, ключевых событиях и исторических личностях.",
    category: "history",
    difficulty: "easy",
    xpReward: 150,
    estimatedMinutes: 8,
    imageUrl: "https://images.unsplash.com/photo-1574492943744-cfb27680f7ce?w=600",
    isCompleted: false,
    bestScore: null,
    questions: [
      {
        id: 1,
        question: "В каком году был основан Владивосток?",
        options: ["1856", "1860", "1872", "1898"],
        correctIndex: 1,
        explanation: "Владивосток был основан 2 июля 1860 года как военный пост на берегу бухты Золотой Рог.",
      },
      {
        id: 2,
        question: "Кто командовал экипажем, основавшим Владивосток?",
        options: ["Геннадий Невельской", "Николай Комаров", "Степан Макаров", "Григорий Шелихов"],
        correctIndex: 1,
        explanation: "Прапорщик Николай Комаров командовал солдатами 4-го линейного батальона, высадившимися с транспорта «Манджур».",
      },
      {
        id: 3,
        question: "Что означает слово «Владивосток»?",
        options: ["«Восточный город»", "«Владеть Востоком»", "«Свободный порт»", "«Город у моря»"],
        correctIndex: 1,
        explanation: "Название образовано от слов «владеть» и «восток» — по аналогии с Владикавказом, означает «владеть Востоком».",
      },
      {
        id: 4,
        question: "В каком году Владивостоку был присвоен статус города?",
        options: ["1860", "1875", "1880", "1888"],
        correctIndex: 2,
        explanation: "Статус города Владивосток получил 22 апреля 1880 года, выделившись из Приморской области в особое «военное губернаторство».",
      },
      {
        id: 5,
        question: "Когда было завершено строительство Транссибирской магистрали до Владивостока?",
        options: ["1891", "1903", "1916", "1923"],
        correctIndex: 2,
        explanation: "Транссибирская магистраль была полностью завершена в 1916 году с открытием моста через Амур у Хабаровска.",
      },
      {
        id: 6,
        question: "Какое имя носит главный исторический фрегат Владивостокской флотилии?",
        options: ["«Аврора»", "«Варяг»", "«Громобой»", "«Паллада»"],
        correctIndex: 1,
        explanation: "Крейсер «Варяг», героически погибший в бою при Чемульпо в 1904 году, входил в состав Владивостокского отряда крейсеров.",
      },
      {
        id: 7,
        question: "Кто из известных российских исследователей Дальнего Востока похоронен во Владивостоке?",
        options: ["Николай Пржевальский", "Владимир Арсеньев", "Иван Крузенштерн", "Юрий Лисянский"],
        correctIndex: 1,
        explanation: "Владимир Клавдиевич Арсеньев — путешественник, географ, автор книг «Дерсу Узала», «По Уссурийскому краю» — похоронен на Морском кладбище Владивостока.",
      },
      {
        id: 8,
        question: "Какое событие произошло во Владивостоке в 2012 году?",
        options: [
          "Чемпионат мира по футболу",
          "Саммит АТЭС",
          "Открытие ДВФУ на материке",
          "Универсиада",
        ],
        correctIndex: 1,
        explanation: "В сентябре 2012 года Владивосток принимал саммит АТЭС, к которому были построены Золотой и Русский мосты, а также кампус ДВФУ.",
      },
    ],
  },
  {
    id: 2,
    title: "География Приморского края",
    description: "Знаете ли вы реки, заливы, острова и горные хребты Приморья?",
    category: "geography",
    difficulty: "medium",
    xpReward: 200,
    estimatedMinutes: 10,
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600",
    isCompleted: false,
    bestScore: null,
    questions: [
      {
        id: 1,
        question: "Какой остров является самым большим в заливе Петра Великого?",
        options: ["Попова", "Рейнеке", "Русский", "Путятина"],
        correctIndex: 2,
        explanation: "Остров Русский площадью около 97,6 км² — крупнейший в заливе Петра Великого. Соединён с материком через Русский мост.",
      },
      {
        id: 2,
        question: "Как называется бухта, на берегу которой расположен исторический центр Владивостока?",
        options: ["Бухта Диомид", "Бухта Золотой Рог", "Уссурийский залив", "Амурский залив"],
        correctIndex: 1,
        explanation: "Бухта Золотой Рог — глубоко вдающийся в сушу залив, разделяющий Владивосток на две части. Названа по аналогии с одноимённой бухтой в Стамбуле.",
      },
      {
        id: 3,
        question: "Какая река — самая большая в Приморском крае?",
        options: ["Уссури", "Раздольная", "Бикин", "Партизанская"],
        correctIndex: 0,
        explanation: "Уссури — крупнейшая река Приморья (длина 897 км), правый приток Амура, образует часть российско-китайской границы.",
      },
      {
        id: 4,
        question: "Какой горный хребет является основным в Приморском крае?",
        options: ["Становой", "Сихотэ-Алинь", "Хамар-Дабан", "Джугджур"],
        correctIndex: 1,
        explanation: "Сихотэ-Алинь — горная страна, простирающаяся вдоль побережья Японского моря на 1200 км. Высшая точка — гора Тордоки-Яни (2090 м).",
      },
      {
        id: 5,
        question: "Какое озеро Приморья считается крупнейшим пресноводным водоёмом региона?",
        options: ["Озеро Ханка", "Озеро Васьково", "Озеро Заречное", "Озеро Благодатное"],
        correctIndex: 0,
        explanation: "Озеро Ханка — крупнейшее на Дальнем Востоке (площадь около 4070 км²), расположено на границе России и Китая.",
      },
      {
        id: 6,
        question: "Какой полуостров образует основную часть Владивостока?",
        options: ["Камчатка", "Муравьёв-Амурский", "Песчаный", "Гамова"],
        correctIndex: 1,
        explanation: "Полуостров Муравьёв-Амурский — основная территория Владивостока, назван в честь генерал-губернатора Восточной Сибири.",
      },
      {
        id: 7,
        question: "Сколько километров составляет длина Золотого моста через бухту Золотой Рог?",
        options: ["737 м", "1 388 м", "2 100 м", "3 100 м"],
        correctIndex: 1,
        explanation: "Длина Золотого моста — 1388 м, длина основного пролёта — 737 м. Один из крупнейших вантовых мостов мира.",
      },
      {
        id: 8,
        question: "Какой климат характерен для Владивостока?",
        options: [
          "Резко-континентальный",
          "Муссонный умеренный",
          "Субтропический",
          "Морской арктический",
        ],
        correctIndex: 1,
        explanation: "Владивосток имеет умеренный муссонный климат с холодной сухой зимой и тёплым влажным летом. Самый ветреный город России.",
      },
    ],
  },
  {
    id: 3,
    title: "Природа и заповедники Приморья",
    description: "Тест на знание уникальной флоры и фауны Дальнего Востока.",
    category: "nature",
    difficulty: "medium",
    xpReward: 200,
    estimatedMinutes: 10,
    imageUrl: "https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?w=600",
    isCompleted: false,
    bestScore: null,
    questions: [
      {
        id: 1,
        question: "Какой большой кошачий хищник — символ Приморского края?",
        options: ["Снежный барс", "Амурский тигр", "Дальневосточный леопард", "Рысь"],
        correctIndex: 1,
        explanation: "Амурский тигр — самый крупный подвид тигра в мире. Изображён на гербе Приморского края, обитает преимущественно в Сихотэ-Алинском заповеднике.",
      },
      {
        id: 2,
        question: "Какое редчайшее животное России обитает только в Приморье?",
        options: [
          "Дальневосточный леопард",
          "Амурский лесной кот",
          "Красный волк",
          "Манул",
        ],
        correctIndex: 0,
        explanation: "Дальневосточный леопард — самая редкая крупная кошка планеты. В природе осталось около 120 особей, охраняется в нацпарке «Земля леопарда».",
      },
      {
        id: 3,
        question: "Какой национальный парк создан для охраны амурского леопарда?",
        options: ["Удэгейская легенда", "Бикин", "Земля леопарда", "Зов тигра"],
        correctIndex: 2,
        explanation: "Национальный парк «Земля леопарда» создан в 2012 году на юго-западе Приморья для сохранения дальневосточного леопарда.",
      },
      {
        id: 4,
        question: "Какое уникальное цветущее растение Приморья называют «русским женьшенем»?",
        options: ["Лимонник", "Элеутерококк", "Женьшень настоящий", "Аралия"],
        correctIndex: 2,
        explanation: "Дальневосточный (настоящий) женьшень — редчайшее реликтовое растение, занесено в Красную книгу России. Произрастает в Уссурийской тайге.",
      },
      {
        id: 5,
        question: "Какой первый в России морской заповедник расположен в Приморье?",
        options: [
          "Кроноцкий заповедник",
          "Дальневосточный морской заповедник",
          "Курильский заповедник",
          "Сахалинский заповедник",
        ],
        correctIndex: 1,
        explanation: "Дальневосточный морской заповедник, основанный в 1978 году в заливе Петра Великого, — первый морской заповедник в России.",
      },
      {
        id: 6,
        question: "Какое уникальное явление наблюдается осенью на Уссурийской тайге?",
        options: [
          "Полярное сияние",
          "Цветение лотосов",
          "Багряные клёны и жёлтые гинкго",
          "Северное цветение сирени",
        ],
        correctIndex: 2,
        explanation: "Уссурийская тайга — единственное место в России, где смешиваются северные хвойные и южные субтропические виды. Осенью особенно красивы клёны и редкое реликтовое дерево гинкго.",
      },
      {
        id: 7,
        question: "Какой морской обитатель встречается в Дальневосточном морском заповеднике?",
        options: [
          "Морская корова",
          "Тюлень-ларга",
          "Белуха",
          "Морж",
        ],
        correctIndex: 1,
        explanation: "Тюлень-ларга (пёстрая нерпа) — обычный обитатель залива Петра Великого. На островах Римского-Корсакова формируются крупные лежбища.",
      },
      {
        id: 8,
        question: "Какая птица — символ дальневосточной природы и нацпарка «Бикин»?",
        options: ["Орлан-белохвост", "Дальневосточный аист", "Чёрный журавль", "Белоплечий орлан"],
        correctIndex: 3,
        explanation: "Белоплечий орлан — крупнейший орлан мира, эндемик Дальнего Востока. Охраняется в нескольких заповедниках Приморья.",
      },
    ],
  },
  {
    id: 4,
    title: "Культура и достопримечательности",
    description: "Музеи, театры, архитектура и креативные пространства Владивостока.",
    category: "culture",
    difficulty: "easy",
    xpReward: 150,
    estimatedMinutes: 7,
    imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600",
    isCompleted: false,
    bestScore: null,
    questions: [
      {
        id: 1,
        question: "Какой музей считается главным краеведческим музеем Приморья?",
        options: [
          "Музей Тихоокеанского флота",
          "Приморский музей им. В.К. Арсеньева",
          "Государственная картинная галерея",
          "Музей города Владивостока",
        ],
        correctIndex: 1,
        explanation: "Приморский государственный объединённый музей имени В.К. Арсеньева — старейший и крупнейший музей Дальнего Востока, основан в 1884 году.",
      },
      {
        id: 2,
        question: "В каком году открылся Приморский театр оперы и балета?",
        options: ["2008", "2013", "2016", "2019"],
        correctIndex: 1,
        explanation: "Приморская сцена Мариинского театра (бывший Приморский театр оперы и балета) открылась в 2013 году. С 2016 года вошла в состав Мариинки.",
      },
      {
        id: 3,
        question: "Как называется главная пешеходная улица Владивостока?",
        options: ["Светланская", "Адмирала Фокина", "Океанский проспект", "Алеутская"],
        correctIndex: 1,
        explanation: "Улица Адмирала Фокина — главная пешеходная улица города, известная как «Владивостокский Арбат».",
      },
      {
        id: 4,
        question: "Где расположен Дальневосточный федеральный университет (ДВФУ)?",
        options: [
          "В центре Владивостока",
          "На острове Русский",
          "В районе Чуркин",
          "В Артёме",
        ],
        correctIndex: 1,
        explanation: "Кампус ДВФУ построен на острове Русский к саммиту АТЭС-2012. Один из крупнейших университетских кампусов России.",
      },
      {
        id: 5,
        question: "Какое культовое сооружение является главным православным храмом Владивостока?",
        options: [
          "Покровский собор",
          "Успенский собор",
          "Никольский собор",
          "Казанский собор",
        ],
        correctIndex: 0,
        explanation: "Покровский кафедральный собор — главный храм Владивостокской епархии, восстановлен в 2007 году на месте разрушенного в 1935-м.",
      },
      {
        id: 6,
        question: "Какой остров известен культурным фестивалем «V-ROX»?",
        options: ["Попова", "Русский", "Аскольд", "Рейнеке"],
        correctIndex: 1,
        explanation: "Международный музыкальный фестиваль V-ROX проходил во Владивостоке (включая площадки на острове Русский) и стал символом креативной культуры города.",
      },
      {
        id: 7,
        question: "Какое архитектурное сооружение — символ Владивостока?",
        options: [
          "Триумфальная арка",
          "Золотой мост",
          "Памятник Муравьёву-Амурскому",
          "Маяк Эгершельда",
        ],
        correctIndex: 1,
        explanation: "Золотой мост через бухту Золотой Рог стал главным архитектурным символом современного Владивостока, изображён на новой 2000-рублёвой купюре.",
      },
    ],
  },
  {
    id: 5,
    title: "Туризм и индустрия гостеприимства Приморья",
    description: "Профессиональный тест для будущих специалистов туристической отрасли.",
    category: "tourism",
    difficulty: "hard",
    xpReward: 300,
    estimatedMinutes: 12,
    imageUrl: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600",
    isCompleted: false,
    bestScore: null,
    questions: [
      {
        id: 1,
        question: "Какой режим действует во Владивостоке для упрощённого въезда иностранных туристов?",
        options: [
          "Безвизовый въезд для всех стран",
          "Свободный порт Владивосток",
          "Особая экономическая зона",
          "Чартерный режим",
        ],
        correctIndex: 1,
        explanation: "Режим Свободного порта Владивосток (с 2015 г.) предусматривает упрощённый визовый режим: электронные визы для граждан 18+ стран сроком до 8 дней.",
      },
      {
        id: 2,
        question: "Какой сезон считается высоким для туристов из Азии в Приморье?",
        options: ["Декабрь — февраль", "Апрель — май", "Июнь — сентябрь", "Октябрь — ноябрь"],
        correctIndex: 2,
        explanation: "Лето и ранняя осень — пик туристического сезона: тёплая погода, цветение, морские прогулки. Большинство китайских и корейских туристов приезжают именно в этот период.",
      },
      {
        id: 3,
        question: "Какой природный объект Приморья включён в список ЮНЕСКО?",
        options: [
          "Озеро Ханка",
          "Центральный Сихотэ-Алинь",
          "Остров Русский",
          "Бухта Золотой Рог",
        ],
        correctIndex: 1,
        explanation: "Центральный Сихотэ-Алинь включён в список Всемирного природного наследия ЮНЕСКО в 2001 году как один из самых биоразнообразных регионов умеренной зоны.",
      },
      {
        id: 4,
        question: "Какая форма туризма наиболее перспективна для развития на острове Русский?",
        options: [
          "Промышленный туризм",
          "Образовательный и научный туризм",
          "Экстремальный альпинизм",
          "Зимние горнолыжные курорты",
        ],
        correctIndex: 1,
        explanation: "С учётом расположения ДВФУ и научных центров остров Русский ориентирован на образовательный, конгрессный и научно-популярный туризм.",
      },
      {
        id: 5,
        question: "Какой региональный туристский бренд продвигает Приморский край?",
        options: [
          "«Открой Дальний Восток»",
          "«Приморье — край исследователей»",
          "«Восточные ворота России»",
          "«Здесь начинается Россия»",
        ],
        correctIndex: 3,
        explanation: "Туристский бренд «Здесь начинается Россия» подчёркивает географическое положение Владивостока — точки, где первой встречает рассвет страны.",
      },
      {
        id: 6,
        question: "Какие объекты составляют основу гастрономического туризма во Владивостоке?",
        options: [
          "Континентальная европейская кухня",
          "Морепродукты и паназиатская кухня",
          "Кавказская кухня",
          "Среднерусские традиционные блюда",
        ],
        correctIndex: 1,
        explanation: "Морепродукты Японского моря (гребешок, краб, кальмар, трепанг) и фьюжн с корейской/японской/китайской кухней — основа уникальной гастрономии Владивостока.",
      },
      {
        id: 7,
        question: "Какое максимальное количество дней действует электронная виза свободного порта Владивосток?",
        options: ["3 дня", "8 дней", "14 дней", "30 дней"],
        correctIndex: 1,
        explanation: "Электронная виза для въезда через свободный порт Владивосток оформляется онлайн и позволяет находиться в Приморском крае до 8 дней.",
      },
      {
        id: 8,
        question: "Какой формат туризма стал популярным трендом в Приморье в последние годы?",
        options: [
          "Космотуризм",
          "Дайвинг и подводный туризм",
          "Сафари в пустыне",
          "Глэмпинг и экологический отдых",
        ],
        correctIndex: 3,
        explanation: "Глэмпинг (комфортный кэмпинг) на побережье и в нацпарках Приморья стал одним из самых быстрорастущих сегментов внутреннего туризма.",
      },
    ],
  },
];

router.get("/quizzes", async (req, res): Promise<void> => {
  let passedSet = new Set<number>();
  const bestScoreMap = new Map<number, number>();

  if (req.user) {
    const attempts = await db
      .select()
      .from(userQuizAttemptsTable)
      .where(eq(userQuizAttemptsTable.userId, req.user.id));

    const bestRatioMap = new Map<number, number>();
    for (const a of attempts) {
      const ratio = a.score / a.total;
      if (ratio > (bestRatioMap.get(a.quizId) ?? -1)) {
        bestRatioMap.set(a.quizId, ratio);
        bestScoreMap.set(a.quizId, a.score);
      }
      if (a.passed === 1) passedSet.add(a.quizId);
    }
  }

  const summaries = QUIZZES.map((q) => ({
    id: q.id,
    title: q.title,
    description: q.description,
    category: q.category,
    difficulty: q.difficulty,
    questionCount: q.questions.length,
    xpReward: q.xpReward,
    estimatedMinutes: q.estimatedMinutes,
    imageUrl: q.imageUrl,
    isCompleted: passedSet.has(q.id),
    bestScore: bestScoreMap.get(q.id) ?? null,
  }));
  res.json(ListQuizzesResponse.parse(summaries));
});

router.get("/quizzes/:id", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetQuizParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const quiz = QUIZZES.find(q => q.id === params.data.id);
  if (!quiz) {
    res.status(404).json({ error: "Quiz not found" });
    return;
  }

  const sanitized = {
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    category: quiz.category,
    difficulty: quiz.difficulty,
    xpReward: quiz.xpReward,
    imageUrl: quiz.imageUrl,
    questions: quiz.questions.map(q => ({
      id: q.id,
      question: q.question,
      options: q.options,
      explanation: q.explanation,
    })),
  };
  res.json(GetQuizResponse.parse(sanitized));
});

router.post("/quizzes/:id/submit", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = SubmitQuizParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const body = SubmitQuizBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const quiz = QUIZZES.find(q => q.id === params.data.id);
  if (!quiz) {
    res.status(404).json({ error: "Quiz not found" });
    return;
  }

  const results = quiz.questions.map((q, i) => ({
    questionId: q.id,
    correct: body.data.answers[i] === q.correctIndex,
    correctAnswerIndex: q.correctIndex,
    explanation: q.explanation,
  }));
  const score = results.filter(r => r.correct).length;
  const total = quiz.questions.length;
  const passed = score / total >= 0.6;
  const xpEarned = passed ? Math.round((score / total) * quiz.xpReward) : Math.round((score / total) * quiz.xpReward * 0.5);

  const u = req.user!;
  const previous = await db
    .select()
    .from(userQuizAttemptsTable)
    .where(and(eq(userQuizAttemptsTable.userId, u.id), eq(userQuizAttemptsTable.quizId, quiz.id), eq(userQuizAttemptsTable.passed, 1)))
    .orderBy(desc(userQuizAttemptsTable.createdAt))
    .limit(1);

  await db.insert(userQuizAttemptsTable).values({
    userId: u.id,
    quizId: quiz.id,
    quizTitle: quiz.title,
    score,
    total,
    xpEarned,
    passed: passed ? 1 : 0,
  });

  if (xpEarned > 0) {
    const [updated] = await db
      .update(usersTable)
      .set({ xp: sql`${usersTable.xp} + ${xpEarned}` })
      .where(eq(usersTable.id, u.id))
      .returning({ newXp: usersTable.xp });
    const newXp = updated?.newXp ?? u.xp + xpEarned;
    const { level } = levelForXp(newXp);
    await db.update(usersTable).set({ level }).where(eq(usersTable.id, u.id));
  }
  if (previous.length === 0 && passed) {
    await db.insert(userActivityTable).values({
      userId: u.id,
      type: "quiz",
      description: `Пройден тест «${quiz.title}» (${score}/${total})`,
      xpEarned,
    });
  }

  res.json(SubmitQuizResponse.parse({ score, total, xpEarned, passed, results }));
});

export default router;
