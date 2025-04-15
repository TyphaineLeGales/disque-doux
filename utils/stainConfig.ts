export interface StainConfig {
  defaultFaceId: number;
  stains: {
    position: {
      x: number; // décalage X depuis le centre de l'écran
      y: number; // décalage Y depuis le centre de l'écran
    };
  }[];
}

export const stainConfig: StainConfig = {
  defaultFaceId: 0, // Face A par défaut (index 0)
  stains: [
    {
      position: {
        x: 87,   // centré horizontalement
        y: -17    // centré verticalement
      }
    },
    {
      position: {
        x: -50, // 50px à gauche du centre
        y: 50   // 50px en dessous du centre
      }
    },
    {
      position: {
        x: 50,  // 50px à droite du centre
        y: -50  // 50px au dessus du centre
      }
    },
    {
      position: {
        x: -30, // 30px à gauche du centre
        y: 70   // 70px en dessous du centre
      }
    }
  ]
}; 