import prisma from '../lib/prisma.js';

export const getStudies = async (req, res) => {
  const studies = await prisma.study.findMany({
    select: {
      id: true,
      nickname: true,
      title: true,
      description: true,
      background: true,
      createdAt: true,
      updatedAt: true,
    },
  }); 

  res.json(studies);
};
