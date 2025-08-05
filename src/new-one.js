.tabs-container {
  display: flex;
  gap: 10px;
  flex-wrap: wrap; /* allows wrapping if needed */
}

.tab {
  padding: 10px 20px;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
}

.tab.active {
  background: #007bff;
  color: white;
}

/* 📱 Stack vertically on small screens */
@media (max-width: 600px) {
  .tabs-container {
    flex-direction: column;
    align-items: stretch;
  }
}