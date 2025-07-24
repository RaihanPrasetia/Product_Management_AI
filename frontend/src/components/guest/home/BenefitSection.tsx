import { Container, Grid, Typography } from "@mui/material"

function BenefitSection() {
    return (
        <Container >
            <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
                Kenapa Belanja di Kami?
            </Typography>
            <Grid container spacing={4} mt={2} columns={{ xs: 4, md: 12 }}>
                <Grid size={4}>
                    <Typography fontWeight="bold" mb={1}>
                        ✓ Produk Berkualitas
                    </Typography>
                    <Typography>
                        Kami hanya menyediakan produk original dan terjamin kualitasnya.
                    </Typography>
                </Grid>
                <Grid size={4}>
                    <Typography fontWeight="bold" mb={1}>
                        ✓ Pengiriman Cepat
                    </Typography>
                    <Typography>
                        Proses pesanan cepat, pengiriman tepat waktu ke seluruh Indonesia.
                    </Typography>
                </Grid>
                <Grid size={4}>
                    <Typography fontWeight="bold" mb={1}>
                        ✓ Layanan Pelanggan 24/7
                    </Typography>
                    <Typography>
                        Tim support kami siap membantu kapanpun kamu butuh.
                    </Typography>
                </Grid>
            </Grid>
        </Container>
    )
}

export default BenefitSection
