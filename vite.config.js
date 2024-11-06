import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 로컬 네트워크에서 접근 가능하게 설정
  },
});
