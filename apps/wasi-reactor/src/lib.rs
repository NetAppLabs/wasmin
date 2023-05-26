struct Component;

impl bindings::Component for Component {
    fn hello(x: String) -> String {
        format!("Hello {}!", x)
    }

    fn uuid() -> String {
        format!("{}", uuid::Uuid::new_v4())
    }
}

bindings::export!(Component);
