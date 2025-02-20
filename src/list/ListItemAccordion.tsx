import React from 'react';
import { Animated } from 'react-native';
import ListItemBase, { ListItemProps } from './ListItemBase';
import ListItemContent from './ListItemContent';
import { withTheme } from '../config';
import { Icon, IconNode, IconProps } from '../icons/Icon';
import { RneFunctionComponent } from '../helpers';

export type ListItemAccordionProps = ListItemProps & {
  isExpanded?: boolean;
  icon?: IconNode;
  expandIcon?: IconNode;
  content?: React.ReactNode;
  noRotation?: boolean;
  noIcon?: boolean;
  animation?:
    | {
        type?: 'timing' | 'spring';
        duration?: number;
      }
    | boolean;
};

const Accordion: RneFunctionComponent<ListItemAccordionProps> = ({
  children,
  isExpanded,
  icon,
  expandIcon,
  content,
  noRotation,
  noIcon,
  animation = {
    duration: 350,
    type: 'timing',
  },
  ...props
}) => {
  const { current: transition } = React.useRef(new Animated.Value(0));

  const startAnimation = React.useCallback(() => {
    if (typeof animation !== 'boolean') {
      Animated[animation.type || 'timing'](transition, {
        toValue: Number(isExpanded),
        useNativeDriver: false,
        duration: animation.duration || 350,
      }).start();
    }
  }, [isExpanded, transition, animation]);

  React.useEffect(() => {
    startAnimation();
  }, [isExpanded, startAnimation]);

  const rotate =
    noRotation || (typeof animation === 'boolean' && animation)
      ? '0deg'
      : transition.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '-180deg'],
        });

  return (
    <>
      <ListItemBase {...props}>
        {React.isValidElement(content) ? content : <ListItemContent />}
        {!noIcon &&
          (icon ? (
            React.createElement(
              Icon,
              (isExpanded ? expandIcon : icon) as IconProps
            )
          ) : (
            <Animated.View
              testID="RNE__ListItem__Accordion__Icon"
              style={{
                transform: [
                  {
                    rotate,
                  },
                ],
              }}
            >
              <Icon name={'chevron-down'} type="material-community" />
            </Animated.View>
          ))}
      </ListItemBase>
      {isExpanded && (
        <Animated.View
          testID="RNE__ListItem__Accordion__Children"
          style={[
            {
              opacity: transition,
            },
          ]}
        >
          {children}
        </Animated.View>
      )}
    </>
  );
};

export default withTheme(Accordion, 'ListItemAccordion');
