import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import type { IBooksParams, TSortBy, TSortKey, TSortOrder } from '@/types/book';
interface IProps {
  setFilters: (params: Partial<IBooksParams>) => void;
  SORT_OPTIONS: Record<
    TSortKey,
    {
      sortBy: TSortBy;
      sortOrder: TSortOrder;
      label: string;
    }
  >;
  currentSort: TSortKey;
  setCurrentSort: (value: TSortKey) => void;
}

export default function SortByMenu(props: IProps) {
  const { setFilters, SORT_OPTIONS, currentSort, setCurrentSort } = props;

  const handleChange = (event: SelectChangeEvent) => {
    const value = event.target.value as TSortKey;
    const { sortBy, sortOrder } = SORT_OPTIONS[value];
    setCurrentSort(value);
    setFilters({
      sortBy,
      sortOrder,
    });
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Sort by</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={currentSort}
          label="Sort by"
          onChange={handleChange}
        >
          {Object.entries(SORT_OPTIONS).map(([key, value]) => (
            <MenuItem value={key}>{value.label}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
