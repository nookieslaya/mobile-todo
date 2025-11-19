import { useTheme } from "@/hooks/useTheme";
import AddTodoButton from "../components/AddTodoButton";
import type { Todo } from "@/types/todo";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import "./../global.css";
import { useEffect, useMemo, useState } from "react";

const API_PORT = process.env.API_PORT?.trim() || "3000";
const TODOS_PATH = "/todos";

function buildApiBaseUrl() {
  const rawHost = process.env.API_HOST?.trim();
  if (rawHost) {
    const noSlashHost = rawHost.replace(/\/+$/, "");
    if (/^https?:\/\//i.test(noSlashHost)) return noSlashHost;
    return noSlashHost.includes(":")
      ? `http://${noSlashHost}`
      : `http://${noSlashHost}:${API_PORT}`;
  }

  const defaultHost = Platform.OS === "android" ? "10.0.2.2" : "127.0.0.1";
  return `http://${defaultHost}:${API_PORT}`;
}

export default function Index() {
  const { toggleDarkMode, colors } = useTheme();

  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState("");
  const baseUrl = useMemo(() => buildApiBaseUrl(), []);

  const handleTodoCreated = (todo: Todo) => {
    setTodos((prev) => [todo, ...prev]);
  };

  async function loadTodos() {
    try {
      const res = await fetch(`${baseUrl}${TODOS_PATH}`);
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    }
  }

  useEffect(() => {
    loadTodos();
  }, [baseUrl]);

  return (
    <View className="flex-1 px-4 pt-6" style={{ backgroundColor: colors.bg }}>
      <Text
        className="mb-4 text-lg uppercase p-2"
        style={{ color: colors.text, backgroundColor: colors.surface }}
      >
        your to do{" "}
      </Text>
      <AddTodoButton baseUrl={baseUrl} onCreate={handleTodoCreated} />

      {error ? (
        <Text className="mb-2" style={{ color: colors.danger }}>
          Error: {error}
        </Text>
      ) : todos.length === 0 ? (
        <Text style={{ color: colors.textMuted }}>No todos yet</Text>
      ) : (
        todos.map((todoItem) => (
          <View
            key={todoItem._id ?? todoItem.name}
            className="mb-3 w-full rounded p-3"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderWidth: 1,
            }}
          >
            <Text style={{ color: colors.text, fontWeight: "600" }}>
              {todoItem.name}
            </Text>
            <Text style={{ color: colors.textMuted }}>
              {todoItem.description}
            </Text>
          </View>
        ))
      )}
    </View>
  );
}
