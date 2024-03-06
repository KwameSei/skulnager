// Calculate subject attendance percentage
export const subjectAttendancePercentage = (activeCount, numOfSessions) => {
  if (numOfSessions === 0 || activeCount === 0) {
    return 0;
  }

  const attendanceNum = (activeCount / numOfSessions) * 100;
  return attendanceNum.toFixed(3)
}

// Calculate overall attendance percentage
export const overallAttendancePercentage = (subjectsAttended) => {
  let totalSessions = 0;
  let activeCount = 0;
  const subjectIds = [];

  subjectsAttended.forEach((attendance) => {
    const subjectId = attendance.subjectName._id;
    if (!subjectIds.includes(subjectId)) {
      const sessions = parseInt(attendance.subjectName.sessions);
      totalSessions += sessions;
      subjectIds.push(subjectId)
    }

    activeCount += attendance.status === "Present" ? 1 : 0;
  })

  if (totalSessions === 0 || activeCount === 0) {
    return 0;
  }

  return (activeCount / totalSessions) * 100;
};

// Calculate subject group attendance
export const subjectGroupAttendance = (subjectsAttended) => {
  const subjectPresentFor = {};

  subjectsAttended.forEach((attendance) => {
    const subjectName = attendance.subjectName;
    const sessions = attendance.subjectName.sessions;
    const subjectId = attendance.subjectName._id;

    if (!subjectPresentFor[subjectName]) {
      subjectPresentFor[subjectName] = {
        present: 0,
        absent: 0,
        sessions: sessions,
        allData: [],
        subjectId: subjectId
      };
    }

    if (attendance.status === "Present") {
      subjectPresentFor[subjectName].present++;
    } else if (attendance.status === "Absent") {
      subjectPresentFor[subjectName].absent++;
    }

    subjectPresentFor[subjectName].allData.push({
      date: attendance.date,
      status: attendance.status,
    });
  });

  return subjectPresentFor;
}