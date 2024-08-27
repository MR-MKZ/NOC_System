export function parseAlertItem(alertItem) {
  const alertText = alertItem.labels.alertname.split(" ").splice(1).join(" ");
  const alertService = alertItem.labels.alertname.split(" ")[0];
  const alertServiceAddr = alertItem.valueString
    .split("instance=")[1]
    ?.split(":")[0];

  return {
    text: alertText,
    service: alertService,
    serviceAddr: alertServiceAddr,
    values: alertItem.values,
    startAt: alertItem.startsAt,
    endAt: alertItem.endsAt,
    fingerprint: alertItem.fingerprint,
  };
}
