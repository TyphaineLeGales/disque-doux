export class StainPosition {
  static calculatePosition(
    screenWidth: number,
    screenHeight: number,
    topInset: number,
    bottomInset: number,
    imageSize: number,
    xPercent: number = 50,
    yPercent: number = 50
  ) {
    // Convertir les pourcentages en coordonnées
    // xPercent et yPercent sont des valeurs entre 0 et 100
    const availableHeight = screenHeight - topInset - bottomInset;
    
    return {
      x: (screenWidth * xPercent) / 100 - imageSize / 2,
      y: (availableHeight * yPercent) / 100 - imageSize / 2,
    };
  }
} 