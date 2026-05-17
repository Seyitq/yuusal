import { settingRepository } from "@/server/repositories/setting.repository";

export const settingService = {
  async get(key: string): Promise<string> {
    const setting = await settingRepository.get(key);
    return setting?.value ?? "";
  },

  async getMany(keys: string[]): Promise<Record<string, string>> {
    const settings = await settingRepository.getMany(keys);
    const result: Record<string, string> = {};
    for (const setting of settings) {
      result[setting.key] = setting.value;
    }
    return result;
  },

  getAll() {
    return settingRepository.getAll();
  },

  set(key: string, value: string) {
    return settingRepository.set(key, value);
  },

  setMany(entries: { key: string; value: string }[]) {
    return settingRepository.setMany(entries);
  },
};
