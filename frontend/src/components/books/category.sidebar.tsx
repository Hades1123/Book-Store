import { memo, useCallback } from 'react';
import { useCategoryQuery } from '@/hooks/queries/useBook';
import { CategoryNode } from './category.node';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

interface Props {
  currentCategory: string | null;
  onCategoryClick: (categoryIds: string) => void;
  onResetCategory: () => void;
  setCurrentCategory: (category: string | null) => void;
}

export const CategorySidebar = memo(
  ({ currentCategory, onCategoryClick, onResetCategory, setCurrentCategory }: Props) => {
    const { data: categoryStructure = [] } = useCategoryQuery();

    const handleClickCategory = useCallback(
      (value: { id: string; label: string }) => {
        const current = categoryStructure.find((item) => value.label === item.name);
        if (current && current.children) {
          const result = current.children.map((item) => item.id);
          result.push(value.id);
          onCategoryClick(result.join(','));
        } else {
          onCategoryClick(value.id);
        }
        setCurrentCategory(value.id);
      },
      [categoryStructure, onCategoryClick, setCurrentCategory]
    );

    return (
      <div className="book__category">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          Category{' '}
          <RestartAltIcon
            onClick={onResetCategory}
            sx={{
              cursor: 'pointer',
              ':hover': {
                color: 'red',
              },
            }}
          />
        </h2>
        {categoryStructure.map((item) => (
          <CategoryNode
            currentCategory={currentCategory}
            handleClickCategory={handleClickCategory}
            category={item}
            key={item.id}
          />
        ))}
      </div>
    );
  }
);