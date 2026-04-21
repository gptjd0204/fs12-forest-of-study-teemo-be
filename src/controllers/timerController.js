import prisma from '../lib/prisma.js';

// 스터디 타이머 생성
export const createTimer = async (req, res) => {
  try {
    const studyId = Number(req.params.studyId);

    const hasStudy = await prisma.study.findFirst({
      where: {
        id: studyId,
      },
    });
    if (!hasStudy) {
      res.status(404).json({
        success: false,
        message: '해당 스터디를 찾을 수 없습니다.',
        errors: [],
      });
      return;
    }

    // 완료된 타이머를 제외하고 조회
    const isTimer = await prisma.timer.findFirst({
      where: {
        studyId,
        status: {
          not: 'COMPLETED',
        },
      },
    });

    // 타이머가 없을때만 타이머 생성
    if (isTimer) {
      res.status(409).json({
        success: false,
        message: '이미 타이머가 생성되었습니다.',
      });
      return;
    }

    const timer = await prisma.timer.create({
      data: {
        studyId,
      },
    });

    res.status(201).json({
      success: true,
      message: '타이머가 정상적으로 생성되었습니다.',
      data: {
        timer,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '서버 내부 오류가 발생했습니다.',
      errors: [error.message],
    });
  }
};

// 타이머 데이터 조회
export const getTimer = async (req, res) => {
  try {
    const studyId = Number(req.params.studyId);

    const study = await prisma.study.findFirst({
      where: {
        id: studyId,
      },
    });
    if (!study) {
      res.status(404).json({
        success: false,
        message: '해당 스터디를 찾을 수 없습니다.',
        errors: [],
      });
      return;
    }

    const timer = await prisma.timer.findFirst({
      where: {
        studyId,
        status: {
          not: 'COMPLETED',
        },
      },
    });

    res.status(200).json({
      success: true,
      message: '요청이 정상적으로 처리되었습니다.',
      data: {
        nickname: study.nickname,
        title: study.title,
        timer,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '서버 내부 오류가 발생했습니다.',
      errors: [error.message],
    });
  }
};

// 집중 목표 시간 설정
export const updateTargetDuraion = async (req, res) => {
  try {
    const studyId = Number(req.params.studyId);
    const targetDuration = Number(req.body.targetDuration);

    const timer = await prisma.timer.findFirst({
      where: {
        studyId,
      },
    });
    if (!timer) {
      res.status(404).json({
        success: false,
        message: '해당 타이머를 찾을 수 없습니다.',
        errors: [],
      });
      return;
    }
    if (timer.status === 'IN_PROGRESS' || timer.status === 'PAUSED') {
      res.status(400).json({
        success: false,
        message: '타이머 진행중엔 수정이 불가합니다.',
      });
      return;
    }

    const updatedTargetDuration = await prisma.timer.updateMany({
      where: {
        studyId,
        status: {
          not: 'COMPLETED',
        },
      },
      data: {
        targetDuration,
      },
    });

    res.status(200).json({
      success: true,
      message: '목표시간이 정상적으로 업데이트 되었습니다.',
      data: {
        updatedTargetDuration,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '서버 내부 오류가 발생했습니다.',
      errors: [error.message],
    });
  }
};

// 타이머 시작
export const updateStart = async (req, res) => {
  try {
    const studyId = Number(req.params.studyId);
    const status = 'IN_PROGRESS';

    const timer = await prisma.timer.findFirst({
      where: {
        studyId,
        status: {
          not: 'COMPLETED',
        },
      },
    });
    if (!timer) {
      res.status(404).json({
        success: false,
        message: '해당 타이머를 찾을 수 없습니다.',
        errors: [],
      });
      return;
    }
    if (timer.status === 'IN_PROGRESS') {
      res.status(204).json({
        success: false,
        message: '타이머가 이미 진행중입니다.',
      });
      return;
    }

    const startedAt = Date.now();

    const updateStatus = await prisma.timer.updateMany({
      where: {
        studyId,
        status: {
          not: 'COMPLETED',
        },
      },
      data: {
        status,
        firstStartedAt:
          timer.firstStartedAt === null ? new Date(startedAt) : undefined,
        lastStartedAt: new Date(startedAt),
      },
    });

    res.status(200).json({
      success: true,
      message: '타이머 상태가 정상적으로 업데이트 되었습니다.',
      data: {
        updateStatus,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '서버 내부 오류가 발생했습니다.',
      errors: [error.message],
    });
  }
};

// 타이머 일시정지
export const updatePause = async (req, res) => {
  try {
    const studyId = Number(req.params.studyId);
    const status = 'PAUSED';

    const timer = await prisma.timer.findFirst({
      where: {
        studyId,
        status: {
          not: 'COMPLETED',
        },
      },
    });
    if (!timer) {
      res.status(404).json({
        success: false,
        message: '해당 타이머를 찾을 수 없습니다.',
        errors: [],
      });
      return;
    }

    if (timer.status === 'CANCELED' || timer.status === 'PAUSED') {
      res.status(204).json({
        success: false,
        message: '타이머가 진행중이지 않습니다.',
      });
      return;
    }

    const now = Date.now();

    const elapsedTime = now - timer.lastStartedAt + timer.elapsedTime;

    const updateStatus = await prisma.timer.updateMany({
      where: {
        studyId,
        status: {
          not: 'COMPLETED',
        },
      },
      data: {
        status,
        elapsedTime,
      },
    });

    res.status(200).json({
      success: true,
      message: '타이머 상태가 정상적으로 업데이트 되었습니다.',
      data: {
        updateStatus,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '서버 내부 오류가 발생했습니다.',
      errors: [error.message],
    });
  }
};

// 타이머 리셋
export const updateReset = async (req, res) => {
  try {
    const studyId = Number(req.params.studyId);
    const status = 'CANCELED';

    const timer = await prisma.timer.findFirst({
      where: {
        studyId,
        status: {
          not: 'COMPLETED',
        },
      },
    });
    if (!timer) {
      res.status(404).json({
        success: false,
        message: '해당 타이머를 찾을 수 없습니다.',
        errors: [],
      });
      return;
    }
    if (timer.status === 'CANCELED') {
      res.status(204).json({
        success: false,
        message: '타이머가 이미 리셋되었습니다.',
      });
      return;
    }

    const updateStatus = await prisma.timer.updateMany({
      where: {
        studyId,
        status: {
          not: 'COMPLETED',
        },
      },
      data: {
        status,
        elapsedTime: 0,
      },
    });

    res.status(200).json({
      success: true,
      message: '타이머 상태가 정상적으로 업데이트 되었습니다.',
      data: {
        updateStatus,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '서버 내부 오류가 발생했습니다.',
      errors: [error.message],
    });
  }
};

// 타이머 집중 완료
export const updateComplete = async (req, res) => {
  try {
    const studyId = Number(req.params.studyId);
    const status = 'COMPLETED';

    const timer = await prisma.timer.findFirst({
      where: {
        studyId,
        status: {
          not: 'COMPLETED',
        },
      },
    });
    if (!timer) {
      res.status(404).json({
        success: false,
        message: '해당 타이머를 찾을 수 없습니다.',
        errors: [],
      });
      return;
    }
    if (timer.status === 'CANCELED') {
      return res.status(204).json({
        success: false,
        message: '타이머가 진행중이지 않습니다.',
      });
    }

    // 서버 현재 시간과 DB에 저장된 경과 시간을 비교 검증
    const now = Date.now();
    const elapsedTime = now - timer.lastStartedAt + timer.elapsedTime;

    if (elapsedTime < timer.targetDuration) {
      res.status(400).json({
        success: false,
        message: '집중 목표 시간을 아직 달성하지 못했습니다.',
        data: {
          targetDuration: timer.targetDuration,
          elapsedTime,
          remainingTime: timer.targetDuration - elapsedTime,
        },
      });
      return;
    }

    // 기본 3포인트 + 설정한 공부시간 10분당 추가 1포인트
    const points = Math.floor(3 + Number(timer.targetDuration) / 600000);
    const completedAt = Date.now();
    const [completedTimer, createdPoint, createdTimer] =
      await prisma.$transaction([
        prisma.timer.updateMany({
          where: {
            studyId,
            status: {
              not: 'COMPLETED',
            },
          },
          data: {
            status,
            elapsedTime,
            completedAt: new Date(completedAt),
          },
        }),
        prisma.pointLog.create({
          data: {
            studyId,
            points,
            focusDuration: timer.targetDuration,
          },
        }),
        prisma.timer.create({
          data: {
            studyId,
          },
        }),
      ]);

    res.status(200).json({
      success: true,
      message: '타이머 상태가 정상적으로 업데이트 되었습니다.',
      data: {
        createdPoint,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '서버 내부 오류가 발생했습니다.',
      errors: [error.message],
    });
  }
};
