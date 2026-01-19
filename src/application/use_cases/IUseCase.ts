/**
 * Interfaces base para casos de uso
 * Siguiendo el patrón Command y Single Responsibility Principle
 */

/**
 * Interface base para casos de uso con input y output
 * @template TInput - Tipo del parámetro de entrada
 * @template TOutput - Tipo del resultado
 */
export interface IUseCase<TInput, TOutput> {
  execute(input: TInput): Promise<TOutput>;
}

/**
 * Interface base para casos de uso sin input (solo output)
 * @template TOutput - Tipo del resultado
 */
export interface IUseCaseNoInput<TOutput> {
  execute(): Promise<TOutput>;
}

/**
 * Interface base para casos de uso con input pero sin output (void)
 * @template TInput - Tipo del parámetro de entrada
 */
export interface IUseCaseVoid<TInput> {
  execute(input: TInput): Promise<void>;
}

/**
 * Interface base para casos de uso sin input ni output (void)
 */
export interface IUseCaseNoInputVoid {
  execute(): Promise<void>;
}
