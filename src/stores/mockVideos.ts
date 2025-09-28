export interface Video {
  id: string;
  title: string;
  src: string;
  poster: string;
  duration: string;
  views: string;
  author: string;
  authorAvatar: string;
  description: string;
  tags: string[];
  publishedAt: string;
}

export const mockVideos: Video[] = [
  {
    id: '1',
    title: '大自然的声音 - 森林小溪',
    src: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
    poster: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2071&auto=format&fit=crop',
    duration: '0:05',
    views: '1.2M',
    author: '自然之声',
    authorAvatar: 'https://i.pravatar.cc/40?u=1',
    description: '聆听大自然的声音，森林小溪流水的声音可以帮助放松身心，缓解压力。',
    tags: ['自然', '放松', '森林', '流水声'],
    publishedAt: '2024-09-15',
  },
  {
    id: '2',
    title: '钢琴独奏 - 月光奏鸣曲',
    src: 'https://samplelib.com/lib/preview/mp4/sample-10s.mp4',
    poster: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=2070&auto=format&fit=crop',
    duration: '0:10',
    views: '890K',
    author: '古典音乐频道',
    authorAvatar: 'https://i.pravatar.cc/40?u=2',
    description: '贝多芬月光奏鸣曲钢琴独奏，优美的旋律让人沉醉其中。',
    tags: ['钢琴', '古典音乐', '贝多芬', '月光奏鸣曲'],
    publishedAt: '2024-09-10',
  },
  {
    id: '3',
    title: '城市街头音乐表演',
    src: 'https://samplelib.com/lib/preview/mp4/sample-15s.mp4',
    poster: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070&auto=format&fit=crop',
    duration: '0:15',
    views: '3.5M',
    author: '街头艺术家',
    authorAvatar: 'https://i.pravatar.cc/40?u=3',
    description: '城市街头的即兴音乐表演，充满活力和创意的声音。',
    tags: ['街头音乐', '现场表演', '城市文化', '艺术'],
    publishedAt: '2024-09-05',
  },
  {
    id: '4',
    title: '电子音乐混音 - 未来之声',
    src: 'https://samplelib.com/lib/preview/mp4/sample-20s.mp4',
    poster: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop',
    duration: '0:20',
    views: '450K',
    author: 'DJ电音制作人',
    authorAvatar: 'https://i.pravatar.cc/40?u=4',
    description: '现代电子音乐混音，融合了多种音效和节奏，带来未来感的听觉体验。',
    tags: ['电子音乐', 'DJ混音', '现代音乐', '节奏'],
    publishedAt: '2024-08-28',
  },
  {
    id: '5',
    title: '雨声 - 自然白噪音',
    src: 'https://samplelib.com/lib/preview/mp4/sample-30s.mp4',
    poster: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=2070&auto=format&fit=crop',
    duration: '0:30',
    views: '1.1M',
    author: '冥想音乐频道',
    authorAvatar: 'https://i.pravatar.cc/40?u=5',
    description: '舒缓的雨声白噪音，帮助睡眠、学习和冥想，创造宁静的环境。',
    tags: ['白噪音', '雨声', '冥想', '睡眠辅助'],
    publishedAt: '2024-08-20',
  },
  {
    id: '6',
    title: '民谣吉他弹唱 - 乡间小路',
    src: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
    poster: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=2070&auto=format&fit=crop',
    duration: '0:05',
    views: '780K',
    author: '民谣歌手',
    authorAvatar: 'https://i.pravatar.cc/40?u=6',
    description: '温暖的民谣吉他弹唱，讲述乡间小路的故事，带来怀旧和温馨的感觉。',
    tags: ['民谣', '吉他', '弹唱', '乡村音乐'],
    publishedAt: '2024-08-15',
  }
];