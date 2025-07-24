import { useEffect, useRef, useState } from 'react';
import { geminiService } from '@/services/gemini/geminiService';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  CircularProgress,
  Paper,
  Chip,
  Stack,
  Link, // Import Link dari MUI untuk "Baca Selengkapnya"
} from '@mui/material';
import { IoClose, IoSend } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';

// Definisikan tipe untuk props
interface ChatModalProps {
  open: boolean;
  handleClose: () => void;
}

// Definisikan tipe untuk pesan (tambahkan isExpanded)
interface Message {
  from: 'user' | 'ai';
  text: string;
  isExpanded?: boolean; // Tambahkan properti ini
}

// Gaya untuk Box di dalam Modal
const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 500 },
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 3,
  borderRadius: 2,
  display: 'flex',
  flexDirection: 'column',
  height: '80vh',
};

// Batas karakter untuk memicu "Baca Selengkapnya"
const TRUNCATE_LIMIT = 200; // Misalnya, 200 karakter

export default function ChatModal({ open, handleClose }: ChatModalProps) {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Opsi pesan awal
  const starterPrompts = [
    'Jelaskan tentang React.js',
    'Bagaimana cara mengoptimalkan Next.js?',
    'Berikan tips UI/UX untuk aplikasi e-commerce',
    'Apa itu Tailwind CSS?',
    "Contoh copywriting yang baik untuk tombol 'Daftar'",
  ];

  // Scroll ke bawah setiap kali ada pesan baru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fungsi untuk mengirim pesan
  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = { from: 'user', text: messageText };
    setMessages((prev) => [...prev, userMessage]);

    setIsLoading(true);

    try {
      const response = await geminiService.chat(messageText);
      // Cek apakah response.reply lebih panjang dari TRUNCATE_LIMIT
      const shouldTruncate = response.reply.length > TRUNCATE_LIMIT;
      const aiMessage: Message = {
        from: 'ai',
        text: response.reply,
        isExpanded: !shouldTruncate, // Awalnya tidak diperluas jika perlu dipotong
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessageText =
        error instanceof Error ? error.message : 'Terjadi kesalahan.';
      const errorMessage: Message = {
        from: 'ai',
        text: errorMessageText,
        isExpanded: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(prompt);
    setPrompt('');
  };

  const handleStarterPromptClick = (starterPrompt: string) => {
    sendMessage(starterPrompt);
  };

  // Fungsi untuk mengubah status isExpanded
  const toggleExpandMessage = (index: number) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg, i) =>
        i === index ? { ...msg, isExpanded: !msg.isExpanded } : msg
      )
    );
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        {/* Header Modal */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pb: 2,
            borderBottom: '1px solid #ddd',
          }}
        >
          <Typography variant="h6" component="h2">
            AI Assistant
          </Typography>
          <IconButton onClick={handleClose}>
            <IoClose />
          </IconButton>
        </Box>

        {/* Daftar Pesan */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', my: 2, p: 1 }}>
          {messages.length === 0 && !isLoading && (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary" mb={2}>
                Halo! Saya AI Asisten Anda. Ada yang bisa saya bantu?
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                justifyContent="center"
              >
                {starterPrompts.map((sp, idx) => (
                  <Chip
                    key={idx}
                    label={sp}
                    onClick={() => handleStarterPromptClick(sp)}
                    disabled={isLoading}
                    sx={{
                      cursor: 'pointer',
                      mb: 1,
                      '&:hover': {
                        backgroundColor: (theme) => theme.palette.primary.light,
                        color: 'white',
                      },
                    }}
                  />
                ))}
              </Stack>
            </Box>
          )}

          <AnimatePresence initial={false}>
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                style={{
                  display: 'flex',
                  justifyContent:
                    msg.from === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: '8px',
                }}
              >
                <Paper
                  elevation={2}
                  sx={{
                    p: 1.5,
                    bgcolor: msg.from === 'user' ? 'primary.main' : 'grey.200',
                    color:
                      msg.from === 'user'
                        ? 'primary.contrastText'
                        : 'text.primary',
                    maxWidth: '80%',
                    wordWrap: 'break-word',
                    borderRadius: '16px',
                    borderBottomRightRadius:
                      msg.from === 'user' ? '4px' : '16px',
                    borderBottomLeftRadius: msg.from === 'ai' ? '4px' : '16px',
                  }}
                >
                  <Typography variant="body1">
                    {/* Tampilkan teks yang dipotong atau seluruhnya */}
                    {msg.from === 'ai' &&
                    msg.text.length > TRUNCATE_LIMIT &&
                    !msg.isExpanded
                      ? `${msg.text.substring(0, TRUNCATE_LIMIT)}...`
                      : msg.text}
                  </Typography>

                  {/* Tombol "Baca Selengkapnya" */}
                  {msg.from === 'ai' && msg.text.length > TRUNCATE_LIMIT && (
                    <Link
                      component="button"
                      variant="body2"
                      onClick={() => toggleExpandMessage(index)}
                      sx={{
                        mt: 1,
                        display: 'block',
                        textAlign: 'right',
                        cursor: 'pointer',
                      }}
                    >
                      {msg.isExpanded ? 'Sembunyikan' : 'Baca Selengkapnya'}
                    </Link>
                  )}
                </Paper>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <CircularProgress
              size={24}
              sx={{ display: 'block', mx: 'auto', mt: 2 }}
            />
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* Form Input */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', gap: 1 }}
        >
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ketik pesan Anda..."
            disabled={isLoading}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            endIcon={<IoSend />}
          >
            Kirim
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
