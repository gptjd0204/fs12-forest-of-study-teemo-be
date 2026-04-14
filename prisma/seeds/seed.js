import { PrismaClient } from '@prisma/client';
import { pointSeedsData, studySeedsData } from './seedDatas.js';

const prisma = new PrismaClient();

async function main() {
  // 기존 데이터 정리
  await prisma.study.deleteMany();
  await prisma.pointLog.deleteMany();

  // product seedData 생성
  // await prisma.study.createMany({
  //   data: studySeedsData,
  // });

  // await prisma.pointLog.createMany({
  //   data: pointSeedsData,
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
