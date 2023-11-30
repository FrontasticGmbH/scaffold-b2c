export const clearSpaces = (value: string) => value.split(' ').join('');

export const getEstimationPhrase = (days: number) => {
  const estimatedDeliveryDate = new Date();

  estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + days);

  const formattedEstimatedDeliveryDate = estimatedDeliveryDate.toLocaleDateString().replace(/\//g, '-');

  const estimationPhrase = `Est. ${formattedEstimatedDeliveryDate} to`;

  return estimationPhrase;
};
