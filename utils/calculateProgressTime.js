function calculateProgressTime(startDateTime, endDateTime) {
    const timeDiffMs = endDateTime - startDateTime;

    const timeDiffMinutes = timeDiffMs / 60000;

    return timeDiffMinutes.toFixed(timeDiffMinutes % 1 !== 0 ? 1 : 0);
}

export default calculateProgressTime