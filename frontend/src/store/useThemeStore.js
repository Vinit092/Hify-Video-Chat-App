import { create } from 'zustand';

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem('hify-theme') || 'forest',
    setTheme:(theme)=>{
        localStorage.setItem("hify-theme",theme) || set({theme});
    },
}));