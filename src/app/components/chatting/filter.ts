export const bannedWords = [
  "간나",
  "갈보",
  "걸레",
  "게이",
  "고자",
  "고아",
  "괴뢰",
  "김치녀",
  "깝",
  "꺼져",
  "꼬붕",
  "남창",
  "애미",
  "애비",
  "니미",
  "느개비",
  "너검",
  "느금",
  "니거",
  "닥쳐",
  "등신",
  "따까리",
  "로리",
  "매국노",
  "메갈",
  "미친",
  "보빨",
  "뻐큐",
  "빨통",
  "쇼타",
  "쌍놈",
  "쌍년",
  "썅",
  "씹",
  "씨발",
  "씨팔",
  "아가리",
  "아다",
  "엠",
  "육변기",
  "장애",
  "젖",
  "좆",
  "조까",
  "지랄",
  "창녀",
  "창남",
  "창년",
  "창놈",
  "한남",
  "한녀",
  "호로",
  "호모",
  "화냥",
  "후빨",
  "ㅈ같",
  "ㄴㅇㅁ",
  "ㄴㄱㅁ",
  "ㅅㅂ",
  "ㅆㅂ",
  "ㅁㅊ",
  "ㅆ",
  "ㅈ됬",
  "ㅈ됐",
  "ㅈ되",
  "ㅈ돼",
];

export function generateRegex(word: string) {
  const chars = word
    .split("")
    .map((ch) => `[${ch}0-9]{0,1}`) // 특수문자 배제, 숫자는 0~1개 허용
    .join("");

  // 자음(ㄱ-ㅎ)과 모음(ㅏ-ㅣ)을 포함하여 한글과 영어가 아닌 문자가 있을 때만 매칭
  return new RegExp(`(?<![ㄱ-ㅎㅏ-ㅣa-zA-Z])${chars}(?![ㄱ-ㅎㅏ-ㅣa-zA-Z])`, "gi");
}

export function isMessageBanned(message: string) {
  if (/^[^ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9]+$/.test(message)) {
    return false;
  }

  return bannedWords.some((word) => generateRegex(word).test(message));
}

export function handleMessageSend(inputMessage: string) {
  if (isMessageBanned(inputMessage)) {
    alert("바르고 고운 말을 씁시다^^");
    return "bad word";
  }
  return inputMessage;
}
