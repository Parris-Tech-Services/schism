import { Route, Routes } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { DashboardPage } from './pages/DashboardPage';
import { LibraryPage } from './pages/LibraryPage';
import { EntryEditorPage } from './pages/EntryEditorPage';
import { TimelinePage } from './pages/TimelinePage';
import { RelationshipsPage } from './pages/RelationshipsPage';
import { CityPage } from './pages/CityPage';
import { RulesPage } from './pages/RulesPage';
import { QuestionsPage } from './pages/QuestionsPage';
import { ContradictionsPage } from './pages/ContradictionsPage';
import { WritingPage } from './pages/WritingPage';
import { AssistantPage } from './pages/AssistantPage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return <Routes><Route element={<AppShell />}><Route index element={<DashboardPage />} /><Route path="library" element={<LibraryPage />} /><Route path="entry/new" element={<EntryEditorPage />} /><Route path="entry/:id" element={<EntryEditorPage />} /><Route path="timeline" element={<TimelinePage />} /><Route path="relationships" element={<RelationshipsPage />} /><Route path="city" element={<CityPage />} /><Route path="rules" element={<RulesPage />} /><Route path="questions" element={<QuestionsPage />} /><Route path="contradictions" element={<ContradictionsPage />} /><Route path="writing" element={<WritingPage />} /><Route path="assistant" element={<AssistantPage />} /><Route path="settings" element={<SettingsPage />} /><Route path="*" element={<NotFoundPage />} /></Route></Routes>;
}
