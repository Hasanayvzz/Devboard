import "./SearchBar.scss";
import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";

interface SearchBarProps {
  onSearch: (username: string) => void;
  loading: boolean;
}

export function SearchBar({ onSearch, loading }: SearchBarProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed) onSearch(trimmed);
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <div className="search-input-wrapper">
        <Search className="search-icon" size={16} />
        <Input
          id="github-username-input"
          type="text"
          placeholder="Search GitHub users"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="search-input"
          autoComplete="off"
          spellCheck={false}
        />
      </div>
      <Button
        id="search-button"
        type="submit"
        disabled={loading || !value.trim()}
        className="search-button">
        {loading ? <Loader2 className="animate-spin" size={16} /> : "Look up"}
      </Button>
    </form>
  );
}
