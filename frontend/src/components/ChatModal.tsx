import { useEffect, useRef, useState } from 'react';
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
} from '@mui/material';
import { IoClose, IoSend } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '@/hooks/useChat';

import remarkGfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';

// Definisikan tipe untuk props
interface ChatModalProps {
  open: boolean;
  handleClose: () => void;
}

// Gaya untuk Box di dalam Modal
const style = {
  position: 'absolute' as 'absolute',
  bottom: '50px', // Jarak dari bawah layar
  right: '50px', // Jarak dari kanan layar
  width: { xs: '90%', sm: 500 },
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 3,
  borderRadius: 2,
  display: 'flex',
  flexDirection: 'column',
  height: '80vh',
};

export default function ChatModal({ open, handleClose }: ChatModalProps) {
  const { messages, isLoading, sendMessage } = useChat();

  const [prompt, setPrompt] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const starterPrompts = ['Laporan Produk', 'Laporan stock'];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    sendMessage(prompt);
    setPrompt(''); // Kosongkan input setelah dikirim
  };

  const handleStarterPromptClick = (starterPrompt: string) => {
    sendMessage(starterPrompt);
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

                    bgcolor: msg.from === 'user' ? 'primary.main' : 'grey.50',

                    color:
                      msg.from === 'user'
                        ? 'primary.contrastText'
                        : 'text.primary',

                    maxWidth: '80%',

                    wordWrap: 'break-word',
                    overflowX: 'hidden',

                    borderRadius: '16px',

                    borderBottomRightRadius:
                      msg.from === 'user' ? '4px' : '16px',

                    borderBottomLeftRadius: msg.from === 'ai' ? '4px' : '16px',
                  }}
                >
                  {msg.from === 'ai' ? (
                    <Box
                      className="markdown-container"
                      sx={{
                        // -> 2. Tambahkan styling untuk tabel di sx prop
                        'p, ul, ol, pre': { m: 0 },
                        overflowX: 'auto',
                        table: {
                          width: '100%',
                          borderCollapse: 'collapse',
                          my: 2,
                          tableLayout: 'auto',
                        },
                        'th, td': {
                          border: '1px solid',
                          borderColor: 'grey.300',
                          p: 1,
                          textAlign: 'left',
                          whiteSpace: 'nowrap',
                        },
                        thead: {
                          backgroundColor: 'grey.100',
                        },
                      }}
                    >
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.text}
                      </ReactMarkdown>
                    </Box>
                  ) : (
                    <Typography variant="body1">{msg.text}</Typography>
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
