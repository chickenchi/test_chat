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
  "시발",
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

export const godWords = [
  "김민",
  "민우",
  "우민",
  "우민",
  "민김",
  "김우",
  "우김",
]

export function generateRegex(word: string) {
  const chars = word
    .split("")
    .map((ch) => `[${ch}]`)  // 각 문자 그대로 매칭하도록 수정
    .join("");

  // 정확히 단어가 포함된 경우만 매칭
  return new RegExp(`(?:^|\\W)${chars}(?:$|\\W)`, "gi");
}

export function checkMessage(message: string): 'god' | 'banned' | 'safe' {
  if (/^[^ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9]+$/.test(message)) {
    return 'safe';
  }

  if (godWords.some(word => generateRegex(word).test(message))) {
    return 'god';
  }

  if (bannedWords.some(word => generateRegex(word).test(message))) {
    return 'banned';
  }

  return 'safe';
}


export function handleMessageSend(inputMessage: string) {
  if (checkMessage(inputMessage) === "banned") {
    alert("바르고 고운 말을 씁시다^^");
    return "bad word";
  } else if (checkMessage(inputMessage) === "god") {
    alert("어허... 그분의 이름은 드러나면 안 돼요!");
    return "bad word";
  }
  return inputMessage;
}
