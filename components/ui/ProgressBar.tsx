import React from 'react';
import { View, Text } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import Svg, {
  Path,
  G,
  Defs,
  Filter,
  FeFlood,
  FeColorMatrix,
  FeOffset,
  FeGaussianBlur,
  FeComposite,
  FeBlend,
} from 'react-native-svg';

import ValidateIcon from '@/components/ui/ValidateIcon';
import { useLevelStore } from '@/stores/levelStore';

type ProgressBarProps = {
  totalPhases: number;
  phaseProgress: number;
};

const COLORS = {
  completed: '#EC7611',
  background: '#E8C29C',
} as const;

const CurrentIcon = () => (
  <Svg width="56" height="55" viewBox="0 0 56 55" fill="none">
    <G filter="url(#filter0_d_168_4138)">
      <Path
        d="M30.3495 6.94453C32.7362 5.53988 35.8117 6.38701 37.1425 8.81562C37.9708 10.3272 39.5314 11.2934 41.2537 11.3611C44.0209 11.4697 46.1502 13.8451 45.9567 16.6077C45.8363 18.3271 46.6268 19.9837 48.0391 20.9717C50.3083 22.5592 50.8153 25.7087 49.159 27.9281C48.1281 29.3095 47.8975 31.1304 48.5515 32.7252C49.6022 35.2875 48.326 38.2111 45.7327 39.1827C44.1186 39.7875 43.5002 41.6104 40.4621 41.8594C40.1812 43.3854 38.6319 42.1178 37.3687 42.7985C36.3773 43.3327 35.9187 43.8557 35.3679 45.502C33.3268 47.102 33.3286 46.9811 32.1496 48.2385C30.2553 50.2586 27.0658 50.3123 25.1046 48.357C23.884 47.14 22.1144 46.6526 20.4428 47.0729C17.7571 47.7483 15.0448 46.069 14.4521 43.3638C14.0833 41.6801 12.8581 40.3134 11.2246 39.7632C8.6001 38.8794 7.2263 36.0003 8.19022 33.4042C8.79017 31.7883 8.49843 29.9761 7.42166 28.6302C5.69165 26.4677 6.09246 23.303 8.30696 21.6401C9.68527 20.6051 10.4196 18.9229 10.2414 17.2085C9.95514 14.454 12.0033 12.0083 14.7653 11.8066C16.4844 11.6811 18.0116 10.663 18.7886 9.12437C20.0369 6.65237 23.0822 5.70228 25.5148 7.02586C27.0288 7.84967 28.864 7.8188 30.3495 6.94453Z"
        fill="#FF3E03"
      />
      <Path
        d="M30.6859 10.2243C32.1057 9.38866 33.9354 9.89263 34.7271 11.3374L35.5985 12.9277C36.0913 13.8269 37.0197 14.4018 38.0444 14.442L39.8563 14.5132C41.5026 14.5778 42.7693 15.991 42.6542 17.6345L42.5276 19.4434C42.4559 20.4663 42.9262 21.4518 43.7664 22.0396L45.2523 23.0791C46.6022 24.0235 46.9039 25.8972 45.9185 27.2176L44.834 28.6708C44.2207 29.4926 44.0835 30.5759 44.4725 31.5247L45.1605 33.2025C45.7856 34.7268 45.0264 36.4661 43.4836 37.0442L41.7855 37.6804C40.8253 38.0402 40.1242 38.8773 39.9385 39.8858L39.6102 41.6692C39.312 43.2895 37.7329 44.3422 36.1225 43.9944L34.3501 43.6116C33.3477 43.3951 32.3053 43.7204 31.6039 44.4684L30.3636 45.7912C29.2367 46.993 27.3391 47.0249 26.1724 45.8617L24.8883 44.5813C24.1621 43.8573 23.1094 43.5674 22.1149 43.8174L20.3563 44.2596C18.7585 44.6614 17.1449 43.6624 16.7923 42.053L16.4043 40.2817C16.1848 39.2801 15.4559 38.4669 14.4841 38.1397L12.7656 37.5609C11.2043 37.0351 10.387 35.3223 10.9604 33.7778L11.5916 32.0778C11.9485 31.1165 11.775 30.0384 11.1344 29.2377L10.0016 27.8218C8.97235 26.5353 9.2108 24.6525 10.5282 23.6632L11.9783 22.5744C12.7983 21.9586 13.2351 20.9579 13.1291 19.9379L12.9417 18.1343C12.7714 16.4956 13.9899 15.0406 15.633 14.9206L17.4415 14.7886C18.4642 14.7139 19.3728 14.1082 19.8351 13.1929L20.6525 11.5742C21.3952 10.1036 23.2068 9.53835 24.654 10.3258L26.2468 11.1925C27.1476 11.6825 28.2394 11.6642 29.1231 11.1441L30.6859 10.2243Z"
        fill="#FF3E03"
        stroke="#FCCB43"
        strokeWidth="0.973199"
      />
      <Path
        d="M33.0291 47.5339L46.0111 39.131C44.5637 38.6505 40.1514 37.5262 37.361 39.0911C34.5707 40.6559 33.5381 45.7212 33.0291 47.5339Z"
        fill="white"
      />
      <Path
        d="M23.7782 35.0162C23.8021 35.0444 23.813 35.0789 23.8386 35.106C23.8756 35.1427 23.9227 35.1578 23.9641 35.1866C24.013 35.2226 24.0607 35.257 24.1143 35.2837C24.1668 35.3087 24.2193 35.3264 24.2752 35.3417C24.3543 35.3661 24.4323 35.3814 24.5138 35.3856C24.5476 35.3863 24.5804 35.3839 24.6147 35.3818C24.7172 35.3769 24.8154 35.3564 24.9153 35.32C24.9328 35.3132 24.9478 35.3043 24.9653 35.2975C25.0312 35.2692 25.0994 35.2516 25.1596 35.2075C25.2025 35.1762 25.2278 35.1296 25.2645 35.0927C25.2662 35.0915 25.2693 35.0907 25.2696 35.0892L36.3695 23.2078C36.4622 23.1127 36.5353 23.0003 36.5845 22.8769C36.6337 22.7536 36.6582 22.6218 36.6564 22.489C36.6547 22.3563 36.6269 22.2251 36.5745 22.1031C36.5221 21.9811 36.4462 21.8706 36.3511 21.778C36.256 21.6853 36.1436 21.6122 36.0202 21.563C35.8969 21.5138 35.7651 21.4893 35.6323 21.4911C35.4996 21.4928 35.3684 21.5206 35.2464 21.573C35.1244 21.6254 35.0139 21.7013 34.9212 21.7964L24.669 32.7696L21.1773 27.727C21.0991 27.6199 21.0005 27.5292 20.8872 27.4601C20.7739 27.3911 20.6481 27.345 20.517 27.3246C20.3859 27.3041 20.2521 27.3097 20.1232 27.341C19.9942 27.3723 19.8727 27.4287 19.7656 27.5069C19.6584 27.5852 19.5677 27.6837 19.4987 27.797C19.4296 27.9103 19.3836 28.0361 19.3631 28.1672C19.3427 28.2983 19.3483 28.4321 19.3796 28.5611C19.4108 28.69 19.4672 28.8115 19.5455 28.9187L23.7458 34.9863C23.7538 34.9981 23.7674 35.0038 23.7782 35.0162Z"
        fill="#FCCB43"
      />
    </G>
    <Defs>
      <Filter
        id="filter0_d_168_4138"
        x="1.03676"
        y="1.97724"
        width="52.3644"
        height="52.1002"
        filterUnits="userSpaceOnUse">
        <FeFlood floodOpacity="0" result="BackgroundImageFix" />
        <FeColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <FeOffset dx="-1.02104" />
        <FeGaussianBlur stdDeviation="2.14419" />
        <FeComposite in2="hardAlpha" operator="out" />
        <FeColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
        <FeBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_168_4138" />
        <FeBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_168_4138"
          result="shape"
        />
      </Filter>
    </Defs>
  </Svg>
);

export default function ProgressBar({ totalPhases, phaseProgress }: ProgressBarProps) {
  const { phaseIndex } = useLevelStore();
  const animatedStyle = useAnimatedStyle(() => ({
    width: withTiming(`${phaseProgress * 100}%`, { duration: 300 }),
  }));

  return (
    <View className="absolute left-0 right-0 top-0 z-20 flex-row items-center justify-center bg-black px-4 py-6">
      <View className="flex-row items-center justify-center">
        {Array.from({ length: totalPhases }).map((_, index) => (
          <React.Fragment key={index}>
            {index < phaseIndex ? (
              <View className="z-50 flex h-[46px] w-[46px] -rotate-6 items-center justify-center">
                <ValidateIcon />
              </View>
            ) : index === phaseIndex ? (
              <View className="rotate-11 z-50 flex h-[48px] w-[48px] items-center justify-center">
                <CurrentIcon />
              </View>
            ) : (
              <View
                className="z-50 h-9 w-9 rounded-full"
                style={{
                  backgroundColor: COLORS.background,
                }}
              />
            )}
            {index < totalPhases - 1 && (
              <View className="relative -ml-1 -mr-1 flex h-[46px] w-[80px] items-center justify-center">
                <View
                  className="z-0 h-2.5 w-full justify-center"
                  style={{
                    backgroundColor: COLORS.background,
                  }}>
                  <Animated.View
                    className="z-0 h-1.5"
                    style={[
                      index === phaseIndex
                        ? animatedStyle
                        : { width: `${index < phaseIndex ? 100 : 0}%` },
                      {
                        backgroundColor:
                          index < phaseIndex
                            ? `${COLORS.completed}`
                            : index === phaseIndex
                              ? COLORS.completed
                              : 'transparent',
                      },
                    ]}
                  />
                </View>
              </View>
            )}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
}
