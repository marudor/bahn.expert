import * as React from 'react';
import styled, { css, keyframes } from 'styled-components/macro';

const gridAnimation = keyframes`
  0%, 70%, 100% {
    transform: scale3D(1, 1, 1);
  }
  35% {
    transform: scale3D(0, 0, 1);
  }
`;
const Grid = styled.div<{ absolute?: boolean }>`
  ${({ absolute }) =>
    absolute &&
    css`
      position: absolute;
    `}
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 35vmin;
  height: 35vmin;
  margin: auto;
  > div {
    width: 33%;
    height: 33%;
    background-color: ${({ theme }) => theme.palette.text.primary};
    float: left;
    animation: ${gridAnimation} 1.3s infinite ease-in-out;
  }
  > div:nth-child(1) {
    animation-delay: 0.2s;
  }
  > div:nth-child(2) {
    animation-delay: 0.3s;
  }
  > div:nth-child(3) {
    animation-delay: 0.4s;
  }
  > div:nth-child(4) {
    animation-delay: 0.1s;
  }
  > div:nth-child(5) {
    animation-delay: 0.2s;
  }
  > div:nth-child(6) {
    animation-delay: 0.3s;
  }
  > div:nth-child(8) {
    animation-delay: 0.1s;
  }
  > div:nth-child(9) {
    animation-delay: 0.2s;
  }
`;

const dotAnimation = keyframes`
  0% {
    top: 6px;
    height: 51px;
  }
  50%, 100% {
    top: 19px;
    height: 26px;
  }
`;

const Dots = styled.div`
  display: inline-block;
  position: relative;
  width: 64px;
  height: 64px;
  > div {
    display: inline-block;
    position: absolute;
    left: 6px;
    width: 13px;
    background: ${({ theme }) => theme.palette.text.primary};
    animation: ${dotAnimation} 1.2s cubic-bezier(0, 0.5, 0.5, 1) infinite;
  }
  > div:nth-child(1) {
    left: 6px;
    animation-delay: -0.24s;
  }
  > div:nth-child(2) {
    left: 26px;
    animation-delay: -0.12s;
  }
  > div:nth-child(3) {
    left: 45px;
  }
`;

interface Props {
  isLoading?: boolean;
  className?: string;
  children?: React.ReactElement;
  type?: LoadingType;
  relative?: boolean;
}

export const enum LoadingType {
  grid,
  dots,
}

function getType(type: LoadingType, absolute: boolean = true) {
  switch (type) {
    default:
    case LoadingType.grid:
      return (
        <Grid data-testid="grid" absolute={absolute}>
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
        </Grid>
      );
    case LoadingType.dots:
      return (
        <Dots data-testid="dots">
          <div />
          <div />
          <div />
        </Dots>
      );
  }
}

const Loading = ({
  isLoading,
  className,
  children,
  relative = false,
  type = LoadingType.grid,
}: Props) => {
  if (isLoading || !children) {
    return (
      <div data-testid="loading" className={className}>
        {getType(type, !relative)}
      </div>
    );
  }

  return children;
};

export default Loading;
