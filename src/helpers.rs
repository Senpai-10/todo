use nanoid::nanoid;

pub fn generate_id(length: usize) -> String {
    let set: [char; 16] = [
        '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'a', 'b', 'c', 'd', 'e', 'f'
    ];

    let id = nanoid!(length, &set);

    return id
}