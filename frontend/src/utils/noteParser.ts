import { Topic, Note } from '../types';

// Utility function to clean markdown symbols from text
export const cleanMarkdown = (text: string): string => {
    if (!text) return '';
    
    return text
        .replace(/#{1,6}\s+/g, '') // Remove markdown headers
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
        .replace(/\*(.*?)\*/g, '$1') // Remove italic
        .replace(/`(.*?)`/g, '$1') // Remove inline code
        .replace(/~~(.*?)~~/g, '$1') // Remove strikethrough
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links, keep text
        .replace(/^\s*[-*+]\s+/gm, '- ') // Normalize bullet points
        .replace(/^\s*\d+\.\s+/gm, (match) => match.trim()) // Normalize numbered lists
        .trim();
};

export const parseRawTopics = (rawText: string): Topic[] => {
    if (!rawText || typeof rawText !== 'string') return [];

    const lines = rawText.split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) return [];

    const topics: Topic[] = [];
    let currentTopic: Topic | null = null;
    let currentNote: Note | null = null;

    for (const line of lines) {
        const trimmedLine = line.trim();

        // Detects a main topic (H2)
        if (trimmedLine.startsWith('## ')) {
            if (currentTopic) {
                if (currentNote) {
                    currentTopic.notes.push(currentNote);
                    currentNote = null;
                }
                if (currentTopic.notes.length > 0) {
                    topics.push(currentTopic);
                }
            }
            currentTopic = {
                id: `topic-${topics.length}-${Date.now()}`,
                title: trimmedLine.substring(3).trim(),
                notes: [],
            };
        } 
        // Detects a sub-topic/note (H3)
        else if (trimmedLine.startsWith('### ')) {
            if (currentTopic) {
                if (currentNote) {
                    currentTopic.notes.push(currentNote);
                }
                const noteTitle = trimmedLine.substring(4).trim();
                currentNote = {
                    id: `${currentTopic.id}-note-${currentTopic.notes.length}-${Date.now()}`,
                    title: noteTitle,
                    content: '',
                };
            }
        } 
        // Regular content line, part of the current note
        else if (currentNote) {
            currentNote.content += `${trimmedLine}\n`;
        }
        // Fallback for content that might appear before the first H3
        else if (currentTopic && trimmedLine.length > 0) {
            if (currentTopic.notes.length === 0) {
                // Create a default note if none exists for the topic
                currentTopic.notes.push({
                    id: `${currentTopic.id}-note-0-${Date.now()}`,
                    title: 'Key Points',
                    content: `${trimmedLine}\n`,
                });
            } else {
                // Add to the last note's content
                currentTopic.notes[currentTopic.notes.length - 1].content += `${trimmedLine}\n`;
            }
        }
    }

    // Add the last processed topic and note
    if (currentTopic) {
        if (currentNote) {
            currentTopic.notes.push(currentNote);
        }
        if (currentTopic.notes.length > 0) {
            topics.push(currentTopic);
        }
    }

    // Final cleanup of content
    return topics.map(topic => ({
        ...topic,
        notes: topic.notes.map(note => ({
            ...note,
            content: note.content.trim(),
        })),
    }));
};