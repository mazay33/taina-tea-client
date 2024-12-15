/**
 * @class ExpiringStorage
 * @classdesc - класс для работы с данными из localStorage с поддержкой сроков хранения
 */
export class ExpiringStorage {
  /**
   * Удалить запись из localStorage по ключу
   * @param {string} key - название ключа
   */
  public static remove(key: string): void {
    try {
      localStorage.removeItem(key);
    }
    catch (error) {
      console.error(`Error removing item with key "${key}" from localStorage:`, error);
    }
  }

  /**
   * Получить данные из localStorage по ключу. Если данные отсутствуют или просрочены, вернет null
   * @param {string} key - название ключа
   * @returns {T | null} - возвращает сохраненное значение или null, если данные просрочены или отсутствуют
   */
  public static get<T>(key: string): T | null {
    try {
      const cached = JSON.parse(localStorage.getItem(key) || 'null');
      if (!cached) {
        return null;
      }

      const { dontUpdate, updateEveryDay } = cached;
      const expires = new Date(cached.expires);
      const currentDate = new Date();

      const isExpired = expires < currentDate;
      const isSameDay = updateEveryDay && this.isSameDay(expires, currentDate);

      // Удаляем данные, если они просрочены и не нужно обновлять каждый день
      if (!dontUpdate && (isExpired && !isSameDay)) {
        this.remove(key);
        return null;
      }

      return cached.value;
    }
    catch (error) {
      console.error(`Error getting item with key "${key}" from localStorage:`, error);
      return null;
    }
  }

  /**
   * Сохранить значение в localStorage
   * @param {string} key - название ключа
   * @param {T} value - сохраняемое значение
   * @param {number | 'day'} [lifeTimeInMinutes=0] - срок хранения в минутах или строка 'day', если нужно обновлять раз в день
   * @returns {T | null} - возвращает сохраненное значение или null, если сохранение не удалось
   */
  public static set<T>(key: string, value: T, lifeTimeInMinutes: number | 'day' = 0): T | null {
    try {
      const currentTime = Date.now();
      const dontUpdate = lifeTimeInMinutes === 0;
      const updateEveryDay = lifeTimeInMinutes === 'day';

      // Если время жизни передано как число, преобразуем его в миллисекунды
      const time = typeof lifeTimeInMinutes === 'number'
        ? lifeTimeInMinutes * 60000
        : 0;

      const expires = new Date(currentTime + time);

      localStorage.setItem(
        key,
        JSON.stringify({ value, expires, dontUpdate, updateEveryDay })
      );

      return this.get<T>(key); // Возвращаем сохраненное значение
    }
    catch (error) {
      console.error(`Error setting item with key "${key}" in localStorage:`, error);
      return null;
    }
  }

  /**
   * Проверяет, совпадают ли дни двух дат (учитывая год, месяц и день)
   * @param {Date} date1 - первая дата
   * @param {Date} date2 - вторая дата
   * @returns {boolean} - возвращает true, если дни совпадают
   */
  private static isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear()
      && date1.getMonth() === date2.getMonth()
      && date1.getDate() === date2.getDate();
  }
}
