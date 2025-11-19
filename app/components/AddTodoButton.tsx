import React from "react";
import { useTheme } from "@/hooks/useTheme";
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useMemo, useState } from "react";
import type { Todo } from "@/types/todo";

const TODOS_PATH = "/todos";

type AddTodoProps = {
  baseUrl: string;
  onCreate: (todo: Todo) => void;
  renderTrigger?: (open: () => void) => React.ReactNode;
};

export default function AddTodoButton({
  baseUrl,
  onCreate,
  renderTrigger,
}: AddTodoProps) {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleModal = () => {
    setModalVisible((prev) => !prev);
    setError("");
  };

  const handleSubmit = async () => {
    if (!name.trim() || !description.trim()) {
      setError("Please fill out both fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}${TODOS_PATH}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to create todo (${res.status})`);
      }

      const createdTodo: Todo = await res.json();
      onCreate(createdTodo);
      setName("");
      setDescription("");
      toggleModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const primaryGradient = useMemo(
    () => ({ borderColor: colors.primary, backgroundColor: colors.surface }),
    [colors]
  );

  const defaultTrigger = (
    <TouchableOpacity
      className="absolute bottom-6 right-6 h-14 w-14 rounded-full items-center justify-center"
      style={[styles.fab, primaryGradient, { shadowColor: colors.shadow }]}
      onPress={toggleModal}
    >
      <Text style={{ color: colors.primary, fontSize: 28 }}>+</Text>
    </TouchableOpacity>
  );

  return (
    <>
      {renderTrigger ? renderTrigger(toggleModal) : defaultTrigger}
      <Modal
        transparent
        visible={modalVisible}
        animationType="slide"
        onRequestClose={toggleModal}
      >
        <View style={styles.modalBackdrop}>
          <View
            style={[
              styles.modalCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Add todo
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.backgrounds.input,
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              placeholder="Name"
              placeholderTextColor={colors.textMuted}
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.backgrounds.editInput,
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              placeholder="Description"
              placeholderTextColor={colors.textMuted}
              value={description}
              onChangeText={setDescription}
              multiline
            />
            {error ? (
              <Text style={{ color: colors.danger }}>{error}</Text>
            ) : null}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  { borderColor: colors.border, marginRight: 10 },
                ]}
                onPress={toggleModal}
              >
                <Text style={{ color: colors.text }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  { backgroundColor: colors.primary },
                ]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={{ color: "#fff" }}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    elevation: 4,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15,17,26,0.75)",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  modalCard: {
    width: "100%",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  actionButton: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
});
