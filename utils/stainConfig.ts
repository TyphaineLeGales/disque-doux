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
  defaultFaceId: 0,
  stains: [
    {
      position: {
        x: -23,  
        y: 107
      }
    },
    {
      position: {
        x: -65,
        y: 96
      }
    },
    {
      position: {
        x: 87,
        y: -17
      }
    },
    {
      position: {
        x: -50,
        y: -50
      }
    }
  ]
}; 