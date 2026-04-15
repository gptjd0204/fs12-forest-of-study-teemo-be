import { PrismaClient } from '@prisma/client';
import { pointSeedsData, studySeedsData, emojiSeedsData } from './seedDatas.js';

const prisma = new PrismaClient();

async function main() {
  // 기존 데이터 정리
  // await prisma.study.deleteMany();
  // await prisma.pointLog.deleteMany();
  // await prisma.emoji.deleteMany();

  // product seedData 생성
  // await prisma.study.createMany({
  //   data: studySeedsData,
  // });

  // await prisma.pointLog.createMany({
  //   data: pointSeedsData,
  // });

  // emoji seedData
  // await prisma.emoji.createMany({
  //   data: emojiSeedsData,
  // });

  console.log('시드 데이터 입력 완료!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
