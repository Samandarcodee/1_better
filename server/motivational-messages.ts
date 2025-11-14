// Motivatsion xabarlar - Odat eslatmalari uchun
export const MOTIVATIONAL_MESSAGES = {
  morning: [
    "🌅 Ertalabki quyosh kabi porlang! Bugungi odatingizni bajaring.",
    "☀️ Yangi kun, yangi imkoniyatlar! Keling, boshlaylik!",
    "🌄 Har bir kun - bu yangi boshlanish. Odatingizni unutmang!",
    "🐦 Qushlar uyg'ondi, siz ham! Bugun ajoyib kun bo'ladi!",
    "💪 Ertalab - eng yaxshi vaqt! Odatingizni bajaring va kuchli bo'ling!",
  ],
  
  afternoon: [
    "🌤️ Kunning yarmi o'tdi! Odatingizni bajarishni unutmang.",
    "⏰ Vaqt o'tmoqda, lekin hali ham imkoniyat bor! Davom eting!",
    "🔥 Streak'ingizni saqlab qoling! Hoziroq bajaring!",
    "💡 Bugun qilmasangiz, ertaga qiyin bo'ladi. Hozir harakat qiling!",
    "🎯 Maqsadga yetish uchun har bir kun muhim. Keling, bajaylik!",
  ],
  
  evening: [
    "🌙 Kun tugashidan oldin odatingizni bajaring!",
    "⭐ Streak'ingiz xavf ostida! Oxirgi imkoniyat!",
    "🔴 DIQQAT! Bugun odatingizni bajarish uchun oz vaqt qoldi!",
    "💥 Kunni ajoyib yakunlang! Odatingizni bajaring!",
    "🏆 Champions hech qachon taslim bo'lmaydi! Keling, tugataylik!",
  ],
  
  motivation: [
    "🚀 Siz zo'rsiz! Davom eting!",
    "💎 Har bir kichik qadam katta natijaga olib keladi!",
    "🌟 Bugun 1% yaxshiroq bo'ling!",
    "⚡ Kuchingiz ichingizda! Ishoning va qiling!",
    "🎨 Hayotingizni o'zingiz yaratayapsiz. Ajoyib ish!",
  ],
  
  streak: {
    new: "🎉 Birinchi kun! Ajoyib boshladingiz!",
    short: "🔥 {streak} kun! Davom eting!",
    medium: "💪 {streak} kun! Siz ajoyib ishni qilyapsiz!",
    long: "⚡ {streak} kun! Siz legendasiz!",
    master: "👑 {streak} kun! Siz MASTER darajaga yetdingiz!",
  }
};

// Random message olish
export function getRandomMessage(category: keyof typeof MOTIVATIONAL_MESSAGES): string {
  const messages = MOTIVATIONAL_MESSAGES[category];
  if (Array.isArray(messages)) {
    return messages[Math.floor(Math.random() * messages.length)];
  }
  return "";
}

// Vaqtga qarab to'g'ri kategoriyani tanlash
export function getMessageByTime(hour: number): string {
  if (hour >= 5 && hour < 12) {
    return getRandomMessage('morning');
  } else if (hour >= 12 && hour < 18) {
    return getRandomMessage('afternoon');
  } else {
    return getRandomMessage('evening');
  }
}

// Streak bo'yicha xabar
export function getStreakMessage(streak: number): string {
  if (streak === 1) return MOTIVATIONAL_MESSAGES.streak.new;
  if (streak < 7) return MOTIVATIONAL_MESSAGES.streak.short.replace('{streak}', streak.toString());
  if (streak < 21) return MOTIVATIONAL_MESSAGES.streak.medium.replace('{streak}', streak.toString());
  if (streak < 66) return MOTIVATIONAL_MESSAGES.streak.long.replace('{streak}', streak.toString());
  return MOTIVATIONAL_MESSAGES.streak.master.replace('{streak}', streak.toString());
}

