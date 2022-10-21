// NOTE: https://docs.rs/clap/3.2.22/clap/_derive/_tutorial/index.html
// NOTE: https://docs.rs/clap/3.2.22/clap/_derive/index.html

use clap::{Parser, Subcommand};

#[derive(Debug, Parser)]
#[clap(author, version, about)]
pub struct Cli {
    #[clap(short, long)]
    pub file: Option<String>,

    #[clap(subcommand)]
    pub commands: Option<Commands>,
}

#[derive(Debug, Subcommand)]
pub enum Commands {
    /// Add a new task
    Add {
        task: String,

        #[clap(short, long)]
        category: String,
    },

    /// delete a task
    Delete {
        ids: Vec<String>,
    },

    /// edit a task
    Edit {
        ids: Vec<String>,
    },

    /// list all tasks or a category
    List {
        category: Option<String>,
    },

    /// move a task from category to another category
    Move {
        /// list ids
        ids: Vec<String>,

        /// target category
        category: String,
    },

    /// mark a task as done
    Done {
        ids: Vec<String>,
    },

    /// mark a task as undone
    Undone {
        ids: Vec<String>,
    },

    /// clear all tasks or a category
    Clear {},
}

