# Course Tracker

A modern, comprehensive learning management system built with React, TypeScript, and Supabase. Track your learning journey with an intuitive interface featuring glassmorphism design, dark/light themes, goal setting, achievement system, and advanced course management tools.

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

### 📝 Enhanced Note-Taking
- **Rich Text Editor**: Create detailed notes for each lesson with markdown support
- **Live Preview**: Switch between edit and preview modes to see formatted content
- **Markdown Support**: Use **bold**, *italic*, lists, and [links](url) in your notes
- **Note Management**: Edit, delete, and organize notes for better study organization

### 🎯 Goal Setting & Achievement System
- **Learning Goals**: Set daily, weekly, monthly, or course-specific learning targets
- **Progress Tracking**: Visual progress bars with increment controls for quick updates
- **Goal Categories**: Organize goals by type (daily habits, weekly targets, course milestones)
- **Smart Completion**: One-click goal completion with automatic progress detection
- **Achievement Badges**: Unlock rewards for hitting study targets and milestones
- **Achievement Categories**: Earn badges for study habits, course completion, streaks, and goals
- **Celebratory Notifications**: Get notified when you unlock new achievements

### 🔥 Study Streak Tracking
- **Daily Streaks**: Maintain consistent study habits with streak counters
- **Activity Timeline**: View recent study activities and their impact on streaks
- **Streak Statistics**: Track current streak vs. longest streak achieved
- **Motivational Feedback**: Encouragement messages based on your streak progress
- **Automatic Tracking**: Streaks update automatically when you complete lessons or exams

### ⚡ Bulk Operations
- **Multi-Select**: Select multiple lessons, exams, or assignments at once
- **Batch Actions**: Mark multiple items as complete/incomplete, reschedule, or delete
- **Smart Selection**: "Select All" functionality with visual selection feedback
- **Efficient Management**: Streamline course management with powerful bulk tools
- **Confirmation Dialogs**: Safe handling of destructive operations

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
- **Tabbed Navigation**: Organized interface with Courses, Goals, and Achievements sections
- **Enhanced Stats Dashboard**: Comprehensive metrics including streaks and goal progress

## 🛠️ Technologies Used

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS with custom glassmorphism design
- **Authentication**: Supabase Auth
- **State Management**: React Context API with multiple specialized contexts
- **Icons**: Lucide React
- **Build Tool**: Vite with hot module replacement
- **Data Persistence**: LocalStorage with user-specific data isolation

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
3. **Set Goals**: Navigate to the Goals tab to create learning objectives
4. **Manage Content**: Add lessons, homework, and exams to your courses
5. **Take Notes**: Add rich text notes to lessons for better organization
6. **Track Progress**: Check off completed items and watch your streaks grow
7. **View Timeline**: Click on any course card to see its chronological timeline
8. **Earn Achievements**: Complete goals and maintain streaks to unlock badges
9. **Use Bulk Operations**: Select multiple items for efficient course management

### Course Management
- **Course Details**: Title, description, start/end dates, and color theme
- **Lesson Types**: Distinguish between lab sessions and regular exercises
- **Homework Tracking**: Due dates, completion, and submission status
- **Progress Calculation**: Automatic progress based on completed lessons

### Goal Setting
- **Goal Types**: Daily, weekly, monthly, or course-specific goals
- **Progress Controls**: Use + button to increment progress or ✓ to mark complete
- **Deadline Tracking**: Visual indicators for approaching deadlines
- **Achievement Integration**: Goal completion triggers automatic achievement checks

### Achievement System
- **Milestone Rewards**: Unlock achievements for first lesson, study streaks, goal completion
- **Visual Gallery**: View all unlocked achievements with dates and descriptions
- **Automatic Detection**: Achievements unlock automatically based on your activity

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

## 🎯 Future Enhancements

Planned features for upcoming releases:
- Study time tracking with Pomodoro timer
- Calendar integration with drag-and-drop scheduling  
- Data export/import functionality
- Mobile PWA support with offline capabilities
- Advanced analytics and progress insights

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Design inspired by modern glassmorphism trends
- Icons provided by [Lucide React](https://lucide.dev/)
- Authentication powered by [Supabase](https://supabase.com/)
- Built with [Vite](https://vitejs.dev/) and [React](https://reactjs.org/)

---

**Made by Tora Blaze with ❤️ for learners everywhere**