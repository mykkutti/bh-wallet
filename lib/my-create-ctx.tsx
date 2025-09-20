import { ASSERT } from '@/lib/assert';
import { createContext, JSX, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

/**
 * 어떤 형태의 상태(T)라도 관리할 수 있는 Context, Provider, Hook을 생성하는 팩토리 함수
 * @param initialCtx - 관리하고자 하는 상태의 초깃값
 * @returns [ContextProvider, useGenericContext] - 생성된 Provider 컴포넌트와 useContext Hook
 */
export function createGenericContext<Ctx extends object>(initialCtx: Ctx) {
  // 제네릭 T를 기반으로 타입 정의
  type DataKey_t = keyof Ctx;
  type DataVal_t<K extends DataKey_t> = Ctx[K];

  type CtxShape_t = {
    ctx: Ctx;
    setCtx: (newCtx: Ctx) => void;
    updateCtx<K extends DataKey_t>(key: K, value: DataVal_t<K>): void;
  };

  // 제네릭 T를 사용하여 Context 생성
  const GenericCtx = createContext<CtxShape_t | undefined>(undefined);

  // 생성된 Context에 대한 Provider 컴포넌트
  const GenericCtxProvider = ({ children }: { children: ReactNode }): JSX.Element => {
    const [sState, setState] = useState<Ctx>(initialCtx);

    const setCtx = useCallback((ctx: Ctx) => {
      setState(ctx);
    }, []);

    const updateCtx = useCallback(<K extends DataKey_t>(key: K, value: DataVal_t<K>) => {
      setState((prev) => ({
        ...prev,
        [key]: value,
      }));
    }, []);

    const ctxValue = useMemo(
      () => ({
        ctx: sState,
        updateCtx,
        setCtx,
      }),
      [sState, setCtx, updateCtx]
    );

    return <GenericCtx.Provider value={ctxValue}>{children}</GenericCtx.Provider>;
  };

  // 생성된 Context를 사용하기 위한 커스텀 Hook
  const useGenericCtx = () => {
    const ctx = useContext(GenericCtx);
    ASSERT(ctx !== undefined, 'useGenericCtx must be used within a corresponding Provider');
    return ctx;
  };

  // Provider와 Hook을 반환
  return [GenericCtxProvider, useGenericCtx] as const;
}
