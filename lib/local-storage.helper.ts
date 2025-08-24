import { VisibilityState } from "@tanstack/react-table";

const STORAGE_KEY_PAGINATION = "dashboad_admin_pagination";
const STORAGE_KEY_COLUMNS_VISIBILITY = "columnVisibility";

export const getPagination = (key: string) => {
  const saved = localStorage.getItem(STORAGE_KEY_PAGINATION);
  if (!saved) return 1;
  try {
    const parsed = JSON.parse(saved);
    return parsed[key] ?? 1;
  } catch (error) {
    return 1;
  }
};

export const setPagination = (key: string, page: number) => {
  const saved = localStorage.getItem(STORAGE_KEY_PAGINATION);
  const parsed = saved ? JSON.parse(saved) : {};
  parsed[key] = page;
  localStorage.setItem(STORAGE_KEY_PAGINATION, JSON.stringify(parsed));
};

export const getColumnsVisibility = (key: string) => {
  const saved = localStorage.getItem(STORAGE_KEY_COLUMNS_VISIBILITY);
  if (!saved) return {};
  try {
    const parsed = JSON.parse(saved);
    return parsed[key] ?? {};
  } catch (error) {
    return {};
  }
};

export const setColumnsVisibility = (key: string, value: VisibilityState) => {
  const saved = localStorage.getItem(STORAGE_KEY_COLUMNS_VISIBILITY);
  const parsed = saved ? JSON.parse(saved) : {};
  parsed[key] = value;
  localStorage.setItem(STORAGE_KEY_COLUMNS_VISIBILITY, JSON.stringify(parsed));
};
