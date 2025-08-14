// Put this near the file top (or in its own component file)
function FieldRow({ label, value, sx }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        alignItems: 'center',
        gap: 1,
        mb: 0.5,
        ...sx,
      }}
    >
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ textTransform: 'uppercase', letterSpacing: .4 }}
      >
        {label}
      </Typography>

      <Typography
        variant="body2"
        sx={{ fontWeight: 600 }}
      >
        {value ?? '—'}
      </Typography>
    </Box>
  );
}
