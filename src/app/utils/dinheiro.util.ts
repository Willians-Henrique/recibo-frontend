// valores monetários vêm como string do backend (ex: "900.00"); helpers pra somar/exibir
export const paraNumero = (valor: string | null | undefined): number => {
  if (!valor) {
    return 0;
  }

  const numero = parseFloat(valor.replace(',', '.'));
  return Number.isFinite(numero) ? numero : 0;
};

export const formatarReais = (valor: number): string => {
  return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};
