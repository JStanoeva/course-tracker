# Course Tracker

A modern, beautiful course tracking application built with React, TypeScript, and Supabase. Track your learning journey with an intuitive interface featuring glassmorphism design, dark/light themes, and comprehensive course management.

## ✨ Features

### 📚 Course Management
- **Create & Edit Courses**: Add courses with descriptions, dates, and color themes
- **Lesson Tracking**: Organize lessons by type (Lab/Exercise) with completion status
- **Homework Management**: Track assignments with due dates and submission status
- **Exam Scheduling**: Schedule and track exam dates and completion
- **Progress Tracking**: Automatic progress calculation based on completed lessons

### 📅 Timeline View
- **Interactive Timeline**: Click any course to view a chronological timeline
- **Event Visualization**: See all lessons, exams, and homework in one unified view
- **Status Indicators**: Color-coded events (completed, overdue, upcoming)
- **Responsive Layout**: Timeline appears below selected course on mobile/tablet

### 🔐 User Authentication
- **Secure Login/Registration**: Email and password authentication via Supabase
- **User Profiles**: Customizable usernames with profile management
- **Password Management**: Change password functionality
- **User-Specific Data**: Personal course data isolated per user

### 🎨 Modern Design
- **Glassmorphism UI**: Beautiful translucent design with backdrop blur effects
- **Dark/Light/System Themes**: Comprehensive theme support with system preference detection
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Smooth Animations**: Micro-interactions and transitions throughout the app

## 🛠️ Technologies Used

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS with custom glassmorphism design
- **Authentication**: Supabase Auth
- **State Management**: React Context API
- **Icons**: Lucide React
- **Build Tool**: Vite with hot module replacement

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/course-tracker.git
   cd course-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Settings > API to get your project URL and anon key
   - Create a `.env` file in the project root:
     ```env
     VITE_SUPABASE_URL=your_supabase_project_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Configure Supabase Auth**
   - In your Supabase dashboard, go to Authentication > Settings
   - **Disable email confirmations** (set "Enable email confirmations" to OFF)
   - This allows users to register without email verification

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Supabase Setup

The application uses Supabase for authentication only. No database tables are required as course data is stored locally per user. The authentication system uses:

- **Built-in Auth**: Supabase's authentication system
- **User Metadata**: Username stored in `user_metadata` field
- **No Custom Tables**: Course data is stored in browser localStorage, isolated per user

## 📱 Usage

### Getting Started
1. **Register/Login**: Create an account or sign in with existing credentials
2. **Add Courses**: Click "Add Course" to create your first course
3. **Manage Content**: Add lessons, homework, and exams to your courses
4. **Track Progress**: Check off completed items to see your progress
5. **View Timeline**: Click on any course card to see its timeline

### Course Management
- **Course Details**: Title, description, start/end dates, and color theme
- **Lesson Types**: Distinguish between lab sessions and regular exercises
- **Homework Tracking**: Due dates, completion, and submission status
- **Progress Calculation**: Automatic progress based on completed lessons

### Timeline Features
- **Chronological View**: All course events sorted by date
- **Event Status**: Visual indicators for completed, overdue, and upcoming items
- **Responsive Design**: Timeline appears below selected course on mobile

## 🎨 Design System

The application uses a custom design system built on Tailwind CSS:

- **Colors**: Custom primary palette with glassmorphism variants
- **Typography**: Clean, readable font hierarchy
- **Spacing**: Consistent 8px spacing system
- **Components**: Reusable components with backdrop blur effects
- **Animations**: Smooth transitions and micro-interactions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Design inspired by modern glassmorphism trends
- Icons provided by [Lucide React](https://lucide.dev/)
- Authentication powered by [Supabase](https://supabase.com/)
- Built with [Vite](https://vitejs.dev/) and [React](https://reactjs.org/)

---

**Made with ❤️ for learners everywhere**